# FutureKawa — Backend siège

Agrégation des backends pays (Colombie live + mocks BR/EC).

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/pays` | Liste des 3 pays + disponibilité |
| `GET /api/v1/pays/{code}/lots` | Proxy lots par pays |
| `GET /api/v1/pays/{code}/alertes` | Proxy alertes par pays |
| `GET /api/v1/stocks` | Stocks consolidés (3 pays) |
| `GET /api/v1/alertes/consolidees` | Alertes consolidées |

## Test

```powershell
docker compose up -d --build
.\scripts\test_etape6.ps1
```

Swagger : http://localhost:8000/docs

**Responsable** : Aziz
