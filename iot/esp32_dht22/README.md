# IoT ESP32 + DHT22 — MicroPython

## Choix technique (étape 2)

**MicroPython** retenu (vs Arduino C++) :

- WiFi natif ESP32
- Même écosystème Python que FastAPI
- Prototypage rapide pour la MSPR

## Paramètres confirmés (exploitation)

| Paramètre | Valeur | Justification |
|-----------|--------|---------------|
| Broche DATA | **GPIO D23** | Câblage carte équipe |
| `device_id` | `FK-CO-ENT01-TH01` | Nommage entreprise (pays / site / capteur) |
| `entrepot_id` | `ENT-CO-BOGOTA-01` | Hub logistique Bogotá — convention `ENT-{ISO}-{VILLE}-{NN}` |
| Topic MQTT | `futurekawa/co/ent-co-bogota-01/mesures` | Hiérarchique, code pays ISO, lowercase |
| Fréquence envoi | **60 s** | Réaliste entrepôt (charge réseau modérée, démo OK) |
| QoS MQTT | **1** | Au moins une fois — fiabilité industrielle |
| Broker prod. | `mqtt.colombie.futurekawa.internal` | DNS interne site Colombie |
| Broker démo | IP LAN du PC Docker | Via `config.py` (ex. `192.168.1.42`) |

Référence centralisée : `config/iot.yaml`

## Câblage DHT22 ↔ ESP32

| DHT22 | ESP32 |
|-------|-------|
| VCC | 3.3V |
| GND | GND |
| DATA | **GPIO D23** (GPIO 23) |

> Si lectures instables : vérifier résistance pull-up 10 kΩ entre DATA et VCC (souvent intégrée au module).

## Topic MQTT & payload

**Topic :** `futurekawa/co/ent-co-bogota-01/mesures`

```json
{
  "device_id": "FK-CO-ENT01-TH01",
  "entrepot_id": "ENT-CO-BOGOTA-01",
  "temperature": 26.5,
  "humidite": 79.2,
  "horodatage": "2026-06-18T15:30:00Z"
}
```

## Configuration locale (secrets)

```bash
cp config.example.py config.py
# Éditer : WIFI_SSID, WIFI_PASSWORD, MQTT_HOST (ipconfig)
```

**Ne jamais committer `config.py`.**

## Fichiers (étape 4)

- `main.py` — boucle principale MicroPython
- `config.py` — secrets locaux (gitignored)
- `config.example.py` — modèle

## Fallback démo

Si matériel indisponible : `iot/mqtt-simulator/` (étape 4).

**Responsable** : Berdan
