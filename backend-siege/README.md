# FutureKawa — Backend siège

Agrégation des backends pays (Colombie live + mocks BR/EC), exposition au frontend, connecteur ERP (étape 8).

## Endpoints prévus

Voir `docs/openapi/openapi-v0.yaml` — section siège (`/pays`, `/erp/sync`).

## Développement local

```bash
cd backend-siege
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Swagger : http://localhost:8000/docs

**Responsable** : Aziz
