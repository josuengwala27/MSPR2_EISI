"""
FutureKawa — Firmware ESP32 + DHT22 (MicroPython)
MSPR TPRE814 — Etape 4

Flasher sur l'ESP32 :
  1. Copier config.example.py -> config.py et renseigner WiFi + IP broker
  2. Copier main.py + config.py sur la carte (Thonny / mpremote / ampy)
  3. Redemarrer l'ESP32

Dependance MQTT (si absente sur la carte) :
  import mip
  mip.install("umqtt.simple")
"""

import json
import time

import dht
import network
from machine import Pin

try:
    import config
except ImportError:
    raise SystemExit("config.py manquant : copier config.example.py vers config.py")

try:
    from umqtt.simple import MQTTClient
except ImportError:
    raise SystemExit("Installer umqtt.simple (voir README.md)")


def connect_wifi(max_retries: int = 20) -> None:
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    if wlan.isconnected():
        return

    print("Connexion WiFi:", config.WIFI_SSID)
    wlan.connect(config.WIFI_SSID, config.WIFI_PASSWORD)

    for attempt in range(max_retries):
        if wlan.isconnected():
            print("WiFi OK:", wlan.ifconfig())
            return
        print("WiFi tentative", attempt + 1)
        time.sleep(2)

    raise RuntimeError("Impossible de se connecter au WiFi")


def sync_time() -> None:
    try:
        import ntptime

        ntptime.host = "pool.ntp.org"
        ntptime.settime()
        print("Heure NTP synchronisee")
    except Exception as exc:
        print("NTP indisponible:", exc)


def iso_utc() -> str:
    try:
        t = time.gmtime()
        return "{:04d}-{:02d}-{:02d}T{:02d}:{:02d}:{:02d}Z".format(
            t[0], t[1], t[2], t[3], t[4], t[5]
        )
    except Exception:
        return ""


def read_dht(sensor):
    for _ in range(3):
        try:
            sensor.measure()
            return sensor.temperature(), sensor.humidity()
        except OSError:
            time.sleep(config.DHT_READ_INTERVAL_SECONDS)
    raise OSError("Lecture DHT22 echouee")


def make_mqtt_client() -> MQTTClient:
    client_id = config.DEVICE_ID.replace(" ", "-")
    return MQTTClient(client_id, config.MQTT_HOST, port=config.MQTT_PORT, keepalive=60)


def publish_measurement(client: MQTTClient, temperature: float, humidite: float) -> None:
    payload = {
        "device_id": config.DEVICE_ID,
        "entrepot_id": config.ENTREPOT_ID,
        "temperature": round(temperature, 1),
        "humidite": round(humidite, 1),
        "horodatage": iso_utc(),
    }
    message = json.dumps(payload)
    client.publish(config.MQTT_TOPIC, message, qos=1)
    print("MQTT publie:", message)


def main() -> None:
    connect_wifi()
    sync_time()

    sensor = dht.DHT22(Pin(config.DHT_PIN))
    client = make_mqtt_client()

    while True:
        try:
            if not network.WLAN(network.STA_IF).isconnected():
                connect_wifi()

            print("Connexion MQTT", config.MQTT_HOST)
            client.connect()
            temperature, humidite = read_dht(sensor)
            publish_measurement(client, temperature, humidite)
            client.disconnect()
        except Exception as exc:
            print("Erreur boucle:", exc)

        time.sleep(config.PUBLISH_INTERVAL_SECONDS)


if __name__ == "__main__":
    main()
