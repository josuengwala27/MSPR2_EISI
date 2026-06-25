# IoT ESP32 + DHT22 — MicroPython

## Fichiers

| Fichier | Role |
|---------|------|
| `main.py` | Firmware principal |
| `config.example.py` | Modele de configuration |
| `config.py` | Secrets locaux (**gitignored**) |

## Installation sur l'ESP32

### 1. Flasher MicroPython

1. Telecharger le firmware ESP32 : https://micropython.org/download/ESP32_GENERIC/
2. Effacer + flasher avec **esptool** ou **Thonny** (Interpreter → Install MicroPython).

### 2. Configurer

```powershell
cd iot\esp32_dht22
copy config.example.py config.py
```

Editer `config.py` :

- `WIFI_SSID` / `WIFI_PASSWORD`
- `MQTT_HOST` = IP LAN du PC Docker (`ipconfig` → IPv4)
- Conserver topic / device_id / GPIO 23

### 3. Installer umqtt (si necessaire)

Sur la carte (REPL Thonny) :

```python
import mip
mip.install("umqtt.simple")
```

### 4. Copier les fichiers sur l'ESP32

Via **Thonny** : `main.py` + `config.py` → "Enregistrer sous..." → MicroPython device.

Ou **mpremote** :

```powershell
mpremote connect COM3 fs cp main.py :
mpremote connect COM3 fs cp config.py :
mpremote reset
```

### 5. Verifier

1. `docker compose up` sur le PC
2. ESP32 sur le **meme reseau WiFi** que le PC
3. Console serie : `MQTT publie: {...}`
4. API : http://localhost:8001/api/v1/mesures/dernieres?entrepot=ENT-CO-BOGOTA-01

## Parametres confirmes

| Parametre | Valeur |
|-----------|--------|
| Broche DATA | **GPIO D23** |
| `device_id` | `FK-CO-ENT01-TH01` |
| `entrepot_id` | `ENT-CO-BOGOTA-01` |
| Topic MQTT | `futurekawa/co/ent-co-bogota-01/mesures` |
| Fréquence | **60 s** |
| QoS | **1** |

## Test REEL avec votre ESP32 + capteur

Le code n'est **pas fictif** : `main.py` lit le **vrai DHT22** sur GPIO 23 et envoie les donnees au **vrai broker Mosquitto** de votre `docker compose`. Le simulateur (`mqtt-simulator/`) sert uniquement si la carte n'est pas disponible.

### Chaine complete

```text
ESP32 + DHT22  --WiFi-->  PC (Mosquitto :1883)  -->  backend Colombie  -->  PostgreSQL  -->  API :8001
```

### 1. Cablage (obligatoire)

| DHT22 | ESP32 |
|-------|-------|
| VCC | 3.3V |
| GND | GND |
| DATA | **GPIO 23 (D23)** |

Schema : `docs/schemas/cablage-esp32-dht22.md`

### 2. Stack Docker sur le PC

```powershell
cd C:\Users\josue\Documents\MSPR2EISI
docker compose up
```

Verifier : http://localhost:8001/api/v1/health

### 3. Configurer l'ESP32

Editer `iot/esp32_dht22/config.py` (deja cree localement, gitignored) :

- `WIFI_SSID` / `WIFI_PASSWORD` = **meme reseau Wi-Fi que le PC**
- `MQTT_HOST` = IP Wi-Fi du PC (`ipconfig` → carte Wi-Fi, actuellement `10.60.88.158`)

> L'ESP32 et le PC doivent etre sur le **meme Wi-Fi** (pas le reseau invite).

### 4. Flasher MicroPython + copier les fichiers

**Thonny** (recommande) :

1. Installer MicroPython sur l'ESP32 (menu Outils → options → Interpreter)
2. Brancher l'ESP32 en USB
3. Ouvrir `main.py` → Fichier → Enregistrer sous → **MicroPython device**
4. Idem pour `config.py`
5. Dans le shell Thonny, si besoin :
   ```python
   import mip
   mip.install("umqtt.simple")
   ```
6. Menu **Executer** → redemarrer la carte (bouton reset)

### 5. Verifier que ca marche

**Console serie Thonny** — vous devez voir :

```text
WiFi OK: ('10.x.x.x', ...)
Connexion MQTT 10.60.88.158
MQTT publie: {"device_id":"FK-CO-ENT01-TH01",...,"temperature":26.1,"humidite":72.3,...}
```

**Terminal PC** — surveiller l'API :

```powershell
.\scripts\watch_mesures.ps1
```

Ou une fois :

```powershell
Invoke-RestMethod "http://localhost:8001/api/v1/mesures/dernieres?entrepot=ENT-CO-BOGOTA-01"
```

**Navigateur** : http://localhost:8001/docs → `GET /api/v1/mesures/dernieres`

Si humidite hors plage (ex. > 85 %), verifier aussi http://localhost:8001/api/v1/alertes et Mailhog http://localhost:8025

### 6. Depannage rapide

| Symptome | Cause probable |
|----------|----------------|
| WiFi echoue | Mauvais SSID/mot de passe, Wi-Fi 5 GHz seulement (ESP32 = 2.4 GHz) |
| MQTT timeout | Mauvaise IP dans `config.py`, firewall Windows bloque le port 1883 |
| `Lecture DHT22 echouee` | Fil DATA pas sur D23, pas de pull-up, cable trop long |
| MQTT OK mais rien en API | `docker compose` pas lance ou backend redemarre |

**Firewall Windows** (si MQTT bloque) — PowerShell admin :

```powershell
New-NetFirewallRule -DisplayName "Mosquitto FutureKawa" -Direction Inbound -LocalPort 1883 -Protocol TCP -Action Allow
```

### Capteur DHT11 ?

Si vous avez un **DHT11** (pas DHT22), remplacer dans `main.py` ligne 105 :

```python
sensor = dht.DHT11(Pin(config.DHT_PIN))
```


Simulateur : `iot/mqtt-simulator/simulate.py`

```powershell
pip install paho-mqtt
python iot/mqtt-simulator/simulate.py --once --host localhost
```

## Depannage

| Probleme | Solution |
|----------|----------|
| `config.py manquant` | Copier `config.example.py` |
| WiFi echoue | Verifier SSID/mot de passe, 2.4 GHz |
| MQTT echoue | Verifier IP PC, port 1883 ouvert, Docker up |
| DHT22 NaN | Verifier cablage D23, pull-up 10 kOhm |
| Pas de mesure en API | Topic identique, meme reseau |

**Responsable** : Berdan
