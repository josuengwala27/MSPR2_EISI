# Simulateur IoT — remplace l'ESP32 quand le materiel n'est pas disponible

Envoie des mesures MQTT **identiques** au firmware reel (meme topic, meme JSON).
Les valeurs varient legerement comme un vrai capteur (plage Colombie OK).

## Demo complete (recommande)

```powershell
.\scripts\run_demo_iot.ps1
```

Lance Docker + simulateur automatique (profile `demo`).

## Manuel

```powershell
pip install -r requirements.txt

# Boucle realiste (60 s) — comme l'ESP32
python simulate.py --host localhost --scenario realistic --interval 60

# Une mesure
python simulate.py --once --host localhost

# Tester une alerte humidite
python simulate.py --once --scenario alerte --host localhost
```

## Verifier

- http://localhost:8001/api/v1/mesures/dernieres?entrepot=ENT-CO-BOGOTA-01
- http://localhost:8001/api/v1/alertes
- `.\scripts\watch_mesures.ps1`

Quand l'ESP32 sera branche : arreter le simulateur (`docker compose --profile demo down`) et lancer `docker compose up` sans profile demo.

**Responsable** : Berdan
