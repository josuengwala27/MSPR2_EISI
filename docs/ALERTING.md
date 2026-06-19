# Alerting — FutureKawa Colombie

## Regles

| Type | Declenchement | Action |
|------|---------------|--------|
| `conditions_non_ideales` | A chaque mesure MQTT recue | Si T ou H hors plage CO → statut lot `alerte` + email |
| `peremption` | Demarrage + cron 06:00 `America/Bogota` + controle horaire (demo) | Lot > 365 j → statut `perime` + email |

## Seuils Colombie

- Temperature : **23–29 °C**
- Humidite : **78–82 %**
- Source : `config/thresholds.yaml`

## Anti-spam

Pas de doublon email pour le meme lot sous **30 minutes** (`config/alerting.yaml`).

## Email (demo)

- SMTP : Mailhog (`mailhog:1025` en Docker)
- Destinataire : `exploitation.colombie@futurekawa.com`
- Interface : http://localhost:8025

## Sujets email

- Conditions : `[FutureKawa ALERTE] Conditions stockage — {pays} — Lot {lot_id}`
- Peremption : `[FutureKawa ALERTE] Peremption stock — {pays} — Lot {lot_id}`

## Test manuel MQTT

```powershell
docker exec mspr2eisi-backend-pays-colombie-1 python -c "import json,paho.mqtt.client as m; c=m.Client(m.CallbackAPIVersion.VERSION2); c.connect('mosquitto-colombie',1883); c.loop_start(); c.publish('futurekawa/co/ent-co-bogota-01/mesures', json.dumps({'device_id':'FK-CO-ENT01-TH01','entrepot_id':'ENT-CO-BOGOTA-01','temperature':27.5,'humidite':90.0}), qos=1); c.loop_stop()"
```

Puis : `curl http://localhost:8001/api/v1/alertes`
