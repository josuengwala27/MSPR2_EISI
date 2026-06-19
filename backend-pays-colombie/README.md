# FutureKawa — Backend pays Colombie (livrable 1)

API REST FastAPI, PostgreSQL, Mosquitto MQTT, alertes email (Mailhog).

## Demarrage Docker (recommande)

Depuis la racine du projet :

```powershell
docker compose up --build
```

Swagger : http://localhost:8001/docs

## Endpoints principaux

| Methode | URL | Description |
|---------|-----|-------------|
| GET | `/api/v1/lots` | Liste lots **FIFO** (tri date stockage ASC) |
| POST | `/api/v1/lots` | Creer un lot |
| GET | `/api/v1/lots/{id}` | Detail lot |
| GET | `/api/v1/lots/{id}/mesures` | Historique T/H depuis stockage |
| GET | `/api/v1/mesures/dernieres?entrepot=...` | Derniere mesure IoT |
| GET | `/api/v1/alertes` | Alertes actives |

## Donnees de demo

Au premier demarrage, 3 lots colombiens sont inseres :

| Lot | Age | Usage |
|-----|-----|-------|
| `LOT-CO-2024-001` | > 365 j | Test alerte peremption |
| `LOT-CO-2026-001` | 45 j | FIFO (plus ancien actif) |
| `LOT-CO-2026-002` | 12 j | FIFO (plus recent) |

Verifier FIFO :

```powershell
curl http://localhost:8001/api/v1/lots
```

Ordre attendu : `LOT-CO-2024-001` → `LOT-CO-2026-001` → `LOT-CO-2026-002`

## Test MQTT → base de donnees

**Windows (recommande)** — depuis le conteneur backend :

```powershell
docker exec mspr2eisi-backend-pays-colombie-1 python -c "import json,paho.mqtt.client as m; c=m.Client(m.CallbackAPIVersion.VERSION2); c.connect('mosquitto-colombie',1883); c.loop_start(); c.publish('futurekawa/co/ent-co-bogota-01/mesures', json.dumps({'device_id':'FK-CO-ENT01-TH01','entrepot_id':'ENT-CO-BOGOTA-01','temperature':27.5,'humidite':79.0}), qos=1); c.loop_stop()"
```

**Local** (si `paho-mqtt` installe) :

```powershell
pip install paho-mqtt
python scripts/publish_test_mesure.py localhost 27.5 79.0
```

Puis :

```powershell
curl "http://localhost:8001/api/v1/mesures/dernieres?entrepot=ENT-CO-BOGOTA-01"
```

Test alerte (hors plage humidite) :

```powershell
python scripts/publish_test_mesure.py localhost 27.5 90.0
curl http://localhost:8001/api/v1/alertes
```

Emails : http://localhost:8025 (Mailhog)

## Dev local (hors Docker)

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
$env:DATABASE_URL="postgresql://futurekawa:futurekawa@localhost:5432/futurekawa_co"
$env:CONFIG_DIR="..\config"
uvicorn app.main:app --reload --port 8001
```

**Responsables** : Anis (API) · Berdan (Docker / MQTT)
