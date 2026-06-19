from __future__ import annotations

import json
import logging
import threading
from datetime import datetime, timezone

import paho.mqtt.client as mqtt
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.database import SessionLocal
from app.models import Mesure
from app.schemas import MqttMesurePayload
from app.services.alert_service import evaluate_conditions_for_entrepot

logger = logging.getLogger(__name__)


class MqttSubscriber:
    def __init__(self) -> None:
        self._client: mqtt.Client | None = None
        self._thread: threading.Thread | None = None
        settings = get_settings()
        self._host = settings.mqtt_host
        self._port = settings.mqtt_port
        self._topic = settings.mqtt_topic

    def _on_connect(
        self,
        client: mqtt.Client,
        _userdata,
        _flags,
        reason_code: mqtt.ReasonCode,
        _properties,
    ) -> None:
        if reason_code == 0:
            client.subscribe(self._topic, qos=1)
            logger.info("MQTT connecte, abonne a %s", self._topic)
        else:
            logger.error("MQTT connexion echouee code=%s", reason_code)

    def _on_message(self, _client: mqtt.Client, _userdata, msg: mqtt.MQTTMessage) -> None:
        try:
            payload = MqttMesurePayload.model_validate_json(msg.payload.decode())
        except Exception:
            logger.exception("Payload MQTT invalide: %s", msg.payload)
            return

        entrepot_id = payload.entrepot_id or "ENT-CO-BOGOTA-01"
        horodatage = payload.horodatage or datetime.now(timezone.utc)

        db: Session = SessionLocal()
        try:
            mesure = Mesure(
                entrepot_id=entrepot_id,
                lot_id=None,
                temperature=payload.temperature,
                humidite=payload.humidite,
                horodatage=horodatage,
                device_id=payload.device_id,
            )
            db.add(mesure)
            db.commit()

            evaluate_conditions_for_entrepot(
                db,
                entrepot_id,
                payload.temperature,
                payload.humidite,
            )
            logger.info(
                "Mesure persistee T=%.1f H=%.1f entrepot=%s",
                payload.temperature,
                payload.humidite,
                entrepot_id,
            )
        except Exception:
            db.rollback()
            logger.exception("Erreur traitement mesure MQTT")
        finally:
            db.close()

    def start(self) -> None:
        self._client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self._client.on_connect = self._on_connect
        self._client.on_message = self._on_message

        def run() -> None:
            assert self._client is not None
            while True:
                try:
                    self._client.connect(self._host, self._port, keepalive=60)
                    self._client.loop_forever()
                except Exception:
                    logger.exception("MQTT deconnecte, reconnexion dans 5s")
                    import time

                    time.sleep(5)

        self._thread = threading.Thread(target=run, daemon=True, name="mqtt-subscriber")
        self._thread.start()
        logger.info("Thread MQTT demarre vers %s:%s", self._host, self._port)

    def publish_test(self, payload: dict) -> None:
        client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        client.connect(self._host, self._port, keepalive=60)
        client.loop_start()
        client.publish(self._topic, json.dumps(payload), qos=1)
        client.loop_stop()
        client.disconnect()


mqtt_subscriber = MqttSubscriber()
