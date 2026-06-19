#!/usr/bin/env python3
"""Publie une mesure MQTT de test (validation etape 3)."""

import json
import sys
from datetime import datetime, timezone

import paho.mqtt.client as mqtt

TOPIC = "futurekawa/co/ent-co-bogota-01/mesures"
HOST = sys.argv[1] if len(sys.argv) > 1 else "localhost"
PORT = 1883

temperature = float(sys.argv[2]) if len(sys.argv) > 2 else 27.5
humidite = float(sys.argv[3]) if len(sys.argv) > 3 else 79.0

payload = {
    "device_id": "FK-CO-ENT01-TH01",
    "entrepot_id": "ENT-CO-BOGOTA-01",
    "temperature": temperature,
    "humidite": humidite,
    "horodatage": datetime.now(timezone.utc).isoformat(),
}

client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
client.connect(HOST, PORT, 60)
client.loop_start()
client.publish(TOPIC, json.dumps(payload), qos=1)
client.loop_stop()
client.disconnect()

print(f"Publie sur {TOPIC}: {payload}")
