#!/usr/bin/env python3
"""
Simulateur IoT FutureKawa — imite l'ESP32 + DHT22 quand le materiel n'est pas dispo.
Publie sur le meme topic / format que le firmware reel.
"""

import argparse
import json
import random
import time
from datetime import datetime, timezone

import paho.mqtt.client as mqtt

DEFAULT_TOPIC = "futurekawa/co/ent-co-bogota-01/mesures"
DEFAULT_DEVICE = "FK-CO-ENT01-TH01"
DEFAULT_ENTREPOT = "ENT-CO-BOGOTA-01"

# Plages Colombie (config/thresholds.yaml) — valeurs dans la zone OK
TEMP_MIN, TEMP_MAX = 24.0, 28.5
HUMID_MIN, HUMID_MAX = 78.5, 81.5


def build_payload(temperature: float, humidite: float) -> dict:
    return {
        "device_id": DEFAULT_DEVICE,
        "entrepot_id": DEFAULT_ENTREPOT,
        "temperature": round(temperature, 1),
        "humidite": round(humidite, 1),
        "horodatage": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    }


def next_realistic_values(temperature: float, humidite: float) -> tuple[float, float]:
    """Petites variations comme un vrai capteur dans l'entrepot Bogota."""
    temperature += random.uniform(-0.35, 0.35)
    humidite += random.uniform(-0.7, 0.7)
    temperature = max(TEMP_MIN, min(TEMP_MAX, temperature))
    humidite = max(HUMID_MIN, min(HUMID_MAX, humidite))
    return temperature, humidite


def main() -> None:
    parser = argparse.ArgumentParser(description="Simulateur MQTT FutureKawa (remplace ESP32)")
    parser.add_argument("--host", default="localhost", help="Broker MQTT")
    parser.add_argument("--port", type=int, default=1883)
    parser.add_argument("--topic", default=DEFAULT_TOPIC)
    parser.add_argument("--interval", type=int, default=60, help="Secondes entre publications")
    parser.add_argument("--temperature", type=float, default=None)
    parser.add_argument("--humidite", type=float, default=None)
    parser.add_argument("--once", action="store_true", help="Une seule publication")
    parser.add_argument(
        "--scenario",
        choices=["realistic", "nominal", "alerte"],
        default="realistic",
        help="realistic=variations capteur OK, nominal=fixe, alerte=humidite hors plage",
    )
    args = parser.parse_args()

    if args.scenario == "nominal" and args.temperature is None:
        args.temperature = 26.5
    if args.scenario == "nominal" and args.humidite is None:
        args.humidite = 79.0

    temperature = args.temperature if args.temperature is not None else 26.2
    humidite = args.humidite if args.humidite is not None else 79.5

    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
    client.connect(args.host, args.port, 60)
    client.loop_start()

    print(f"Simulateur ESP32 demarre -> {args.host}:{args.port} | scenario={args.scenario} | interval={args.interval}s")

    try:
        while True:
            if args.scenario == "realistic":
                temperature, humidite = next_realistic_values(temperature, humidite)
            elif args.scenario == "alerte":
                temperature = 27.0
                humidite = 90.0

            payload = build_payload(temperature, humidite)
            client.publish(args.topic, json.dumps(payload), qos=1)
            print(f"Publie: T={payload['temperature']}°C H={payload['humidite']}%")
            if args.once:
                break
            time.sleep(args.interval)
    finally:
        client.loop_stop()
        client.disconnect()


if __name__ == "__main__":
    main()
