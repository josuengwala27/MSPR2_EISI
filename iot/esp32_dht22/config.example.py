"""
Configuration locale ESP32 — NE PAS COMMITTER (config.py est dans .gitignore)

Copier ce fichier :
    cp config.example.py config.py
Puis renseigner WiFi et l'IP du broker MQTT (poste démo Docker).
"""

# --- WiFi (réseau labo / domicile / campus) ---
WIFI_SSID = "VOTRE_SSID"
WIFI_PASSWORD = "VOTRE_MOT_DE_PASSE"

# --- Broker MQTT ---
# IP LAN du PC qui exécute `docker compose` (commande : ipconfig sur Windows)
# Exemple typique réseau domestique : 192.168.1.42
# En production FutureKawa : mqtt.colombie.futurekawa.internal
MQTT_HOST = "192.168.1.42"
MQTT_PORT = 1883

# --- Identifiants alignés config/iot.yaml ---
MQTT_TOPIC = "futurekawa/co/ent-co-bogota-01/mesures"
DEVICE_ID = "FK-CO-ENT01-TH01"
ENTREPOT_ID = "ENT-CO-BOGOTA-01"

# --- Timing ---
PUBLISH_INTERVAL_SECONDS = 60
DHT_READ_INTERVAL_SECONDS = 2  # DHT22 : minimum 2 s entre deux lectures

# --- GPIO ---
DHT_PIN = 23  # Broche D23
