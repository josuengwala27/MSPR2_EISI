# FutureKawa — Backend pays Colombie

Backend local complet (livrable 1) : API REST, PostgreSQL, Mosquitto, alertes email.

## Endpoints prévus

Voir `docs/openapi/openapi-v0.yaml`.

## Développement local

```bash
cd backend-pays-colombie
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Swagger : http://localhost:8001/docs

## Docker (étape 3)

```bash
docker compose -f docker-compose.yml up --build
```

**Responsables** : Anis (API) · Berdan (Docker / MQTT)
