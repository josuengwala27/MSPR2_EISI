# Alerting — FutureKawa Colombie (Etape 5)

## Vue d'ensemble

Le backend Colombie declenche automatiquement des alertes et envoie des emails au responsable d'exploitation.

| Regle | Declencheur | Effet |
|-------|-------------|-------|
| **Conditions non ideales** | Chaque mesure MQTT recue | T ou H hors plage → lots en `alerte` + email |
| **Peremption** | Demarrage + cron 06:00 Bogota + controle horaire (demo) | Lot > 365 j → statut `perime` + email |

Fichiers :

- Regles : `backend-pays-colombie/app/services/alert_service.py`
- Seuils : `config/thresholds.yaml`
- Politique : `config/alerting.yaml`
- Scheduler : `backend-pays-colombie/app/services/scheduler.py`

## Seuils Colombie

| Parametre | Min | Max |
|-----------|-----|-----|
| Temperature | 23 °C | 29 °C |
| Humidite | 78 % | 82 % |
| Peremption | — | 365 jours en stock |

Destinataire email : `exploitation.colombie@futurekawa.com`

## Anti-spam

Pas de doublon email pour le **meme lot** et le **meme type** d'alerte sous **30 minutes**.

## Emails (demo)

- SMTP : Mailhog (`mailhog:1025` dans Docker)
- Interface web : http://localhost:8025

### Sujets

- Conditions : `[FutureKawa ALERTE] Conditions stockage — CO — Lot {lot_id}`
- Peremption : `[FutureKawa ALERTE] Peremption stock — CO — Lot {lot_id}`

## Statuts lots

| Statut | Signification |
|--------|---------------|
| `conforme` | Conditions OK |
| `alerte` | Temperature ou humidite hors plage |
| `perime` | En stock depuis plus de 365 jours |

## Test etape 5 (automatise)

```powershell
cd C:\Users\josue\Documents\MSPR2EISI
docker compose up -d
.\scripts\test_etape5.ps1
```

## Cas de test manuels

### Test 1 — Alerte conditions (humidite hors plage)

```powershell
python iot/mqtt-simulator/simulate.py --once --scenario alerte --host localhost
```

Verifier :

- http://localhost:8001/api/v1/alertes → type `conditions_non_ideales`, `email_envoye: true`
- http://localhost:8001/api/v1/lots → lots actifs en statut `alerte`
- http://localhost:8025 → email recu

### Test 2 — Peremption (lot > 365 jours)

Au demarrage, le lot `LOT-CO-2024-001` (400 j en stock) est automatiquement passe en `perime`.

Verifier :

- http://localhost:8001/api/v1/lots → `LOT-CO-2024-001` statut `perime`
- http://localhost:8001/api/v1/alertes → type `peremption`

Forcer un nouveau controle :

```powershell
docker exec mspr2eisi-backend-pays-colombie-1 python -c "from app.core.database import SessionLocal; from app.services.alert_service import check_peremption; from app.services.thresholds import load_peremption_jours; db=SessionLocal(); print('lots alertes:', check_peremption(db, load_peremption_jours())); db.close()"
```

### Test 3 — Retour a la normale

```powershell
python iot/mqtt-simulator/simulate.py --once --host localhost --temperature 26.5 --humidite 79.5 --scenario nominal
```

Les lots repassent en `conforme` (alertes conditions restent en base mais non resolues — comportement attendu demo).

## Donnees demo (seed)

| Lot | Age stock | Statut attendu au demarrage |
|-----|-----------|----------------------------|
| LOT-CO-2024-001 | ~400 j | `perime` |
| LOT-CO-2026-001 | ~45 j | `conforme` (ou `alerte` si mesure hors plage) |
| LOT-CO-2026-002 | ~12 j | `conforme` |
