# Dossier technique — FutureKawa MSPR TPRE814

> Livrable 4 — en cours de rédaction.  
> Équipe : Josué · Anis · Aziz · Rahma · Berdan

---

## 4.1 Architecture globale

### 4.1.1 Contexte et périmètre

FutureKawa exploite des entrepôts de café vert au **Brésil**, en **Équateur** et en **Colombie**. Le SI existant est **hybride** : ERP au siège, outils opérationnels hétérogènes en entrepôt. Notre solution est une **couche applicative opérationnelle** dédiée à :

- la traçabilité des lots en stock ;
- la surveillance IoT température / humidité ;
- les alertes qualité et péremption ;
- la consolidation au siège.

Le **backend pays complet** est implémenté pour la **Colombie**. Le Brésil et l'Équateur sont simulés (mocks API) pour la démonstration multi-pays sans tripler l'effort de développement.

### 4.1.2 Schéma d'infrastructure

Voir `docs/schemas/architecture-globale.md` (diagrammes Mermaid).

Export PNG pour soutenance : générer depuis Mermaid Live Editor à partir des diagrammes du fichier ci-dessus.

### 4.1.3 Flux principaux

1. **IoT** : ESP32 + DHT22 publie température et humidité via **MQTT** vers Mosquitto local.
2. **Backend pays** : subscriber MQTT → persistance PostgreSQL → évaluation seuils → alertes + email.
3. **Backend siège** : interroge les APIs pays (REST) → expose endpoints consolidés au frontend.
4. **Frontend** : sélection pays → lots FIFO → courbes historiques → alertes.

### 4.1.4 Choix technologiques

| Technologie | Justification |
|-------------|---------------|
| FastAPI | Maîtrise équipe, OpenAPI natif, performances async |
| PostgreSQL | Exigence SQL du CDC, fiabilité, JSON si besoin |
| Mosquitto | Broker MQTT standard, image Docker officielle |
| React + Chart.js | Référencé sujet, courbes temporelles |
| Docker Compose | Livrable 1 exige `docker compose up` reproductible |
| MicroPython (ESP32) | WiFi intégré, cohérence Python avec backend |
| Jenkins | Exigence CDC pipelines CI/CD |
| Mailhog | Démonstration emails sans SMTP production |

### 4.1.5 Critères C2 — stabilité, efficacité, pérennité

**Stabilité**

- Persistance locale par pays (pas de dépendance réseau inter-pays pour l'acquisition IoT).
- Healthchecks Docker sur chaque service.
- Gestion des backends pays indisponibles côté siège (HTTP 502 explicite).

**Efficacité**

- MQTT pour flux capteurs (faible overhead).
- API REST stateless, tri FIFO en base (index sur `date_stockage`).
- Mocks BR/EC légers pour la démo.

**Pérennité**

- Contrat OpenAPI versionné (`docs/openapi/openapi-v0.yaml`).
- Seuils pays externalisés (`config/thresholds.yaml`).
- Structure monorepo claire, conteneurisation industrialisable.

### 4.1.6 Robustesse (logs, supervision, reprise)

| Mécanisme | Implémentation prévue |
|-----------|----------------------|
| Logs applicatifs | stdout JSON / niveau INFO+ERROR (FastAPI + uvicorn) |
| Healthcheck | `GET /api/v1/health` sur chaque backend |
| Reconnexion IoT | Firmware MicroPython : retry WiFi + MQTT |
| Sauvegarde données | Volume Docker PostgreSQL |
| Supervision | Étape 9 — métriques via logs + Jenkins |

### 4.1.7 Intégration ERP (option B)

L'ERP au siège reste le **système de gestion intégré** (achats, ventes, compta). Notre application n'y substitue pas un module SAP : elle **alimente** l'ERP via un connecteur paramétrable.

- Fichier de mapping : `config/erp_mapping.yaml`
- Module siège : `backend-siege/erp_integration/` (étape 8)
- Flux : lots + alertes exportés en JSON selon mapping documenté

*Argumentaire oral C4 : couche opérationnelle IoT/stocks → connecteur paramétrable → ERP existant.*

---

## 4.2 Conception du module IoT

### Materiel

| Composant | Reference |
|-----------|-----------|
| Carte | ESP32-WROOM-32 (WiFi + BT) |
| Capteur | DHT22 |
| Broche DATA | GPIO **D23** (GPIO 23) |

Schema cablage : `docs/schemas/cablage-esp32-dht22.md`

### Firmware

- **Runtime** : MicroPython
- **Fichier principal** : `iot/esp32_dht22/main.py`
- **Configuration locale** : `iot/esp32_dht22/config.py` (non versionne)

### Protocole MQTT

| Element | Valeur |
|---------|--------|
| Topic | `futurekawa/co/ent-co-bogota-01/mesures` |
| QoS | 1 |
| Frequence | 60 secondes |
| Broker demo | IP LAN poste Docker, port 1883 |
| Broker prod. | `mqtt.colombie.futurekawa.internal` |

**Payload JSON :**

```json
{
  "device_id": "FK-CO-ENT01-TH01",
  "entrepot_id": "ENT-CO-BOGOTA-01",
  "temperature": 26.5,
  "humidite": 79.0,
  "horodatage": "2026-06-19T15:30:00Z"
}
```

Le backend Colombie (`mqtt_subscriber.py`) persiste la mesure et evalue les seuils.

### Reconnexion et gestion d'erreurs

- **WiFi** : jusqu'a 20 tentatives, reconnexion dans la boucle principale
- **MQTT** : connexion a chaque cycle, deconnexion propre apres publish
- **DHT22** : 3 tentatives de lecture, delai 2 s (contrainte capteur)
- **NTP** : synchronisation horaire si disponible (`ntptime`)

### Fallback demo

Simulateur Python : `iot/mqtt-simulator/simulate.py` (si ESP32 indisponible).

### Limites et risques

| Risque | Mitigation |
|--------|------------|
| Reseau WiFi instable | Reconnexion automatique |
| Lecture DHT22 erronnee | Retry + pull-up 10 kOhm |
| Horodatage incorrect sans NTP | Backend complete `horodatage` si absent |
| IP broker change | Documenter `ipconfig` dans config.py |

---

## 4.3 Plans de tests détaillés

*À compléter étape 9 — Berdan + Anis*

- Stratégie : unitaire, intégration, API, UI, end-to-end
- Cas de test, jeux de données, critères de succès
- Gestion des anomalies

---

*Dernière mise à jour : étape 2 — ébauche § 4.1*
