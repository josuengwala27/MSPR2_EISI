# FutureKawa — MSPR TPRE814 (Bloc 4 EISI)

Solution applicative multi-pays de suivi des stocks de café vert et des conditions de stockage (IoT), avec consolidation au siège.

**Équipe** : Josué · Anis · Aziz · Rahma · Berdan  
**Soutenance** : lundi 6 juillet  
**Backend pays exemple** : Colombie (complet) · Brésil / Équateur (mocks)

## Stack

| Couche | Technologie |
|--------|-------------|
| Backend | Python 3.11+ · FastAPI |
| Base de données | PostgreSQL 16 |
| MQTT | Eclipse Mosquitto |
| Frontend | React · Chart.js |
| IoT | ESP32 · DHT22 · **MicroPython** |
| Conteneurs | Docker · Docker Compose |
| CI/CD | Jenkins (local) |
| ERP | Option B — connecteur + mapping YAML |

## Structure du dépôt

```
MSPR2EISI/
├── backend-pays-colombie/   # API locale Colombie (livrable 1)
├── backend-siege/           # Agrégation + intégration ERP
├── frontend/                # Interface web siège
├── iot/esp32_dht22/         # Firmware MicroPython
├── mocks/backends-br-ec/    # Mocks Brésil & Équateur
├── config/                  # Seuils pays, mapping ERP
├── docs/                    # Documentation & OpenAPI
├── jenkins/                 # Pipeline CI/CD
└── docker-compose.yml       # Stack complète démo
```

## Prérequis

- [Docker Desktop](https://docs.docker.com/get-docker/) (ou Docker Engine + Compose v2)
- [Python 3.11+](https://www.python.org/) (développement local hors Docker)
- [Node.js 20+](https://nodejs.org/) (frontend, étape 7)
- [Git](https://git-scm.com/)
- Jenkins local (étape 9) — voir `docs/05_CI_CD.md` (à rédiger)

## Démarrage rapide (objectif étape 3+)

```bash
# Cloner le dépôt
git clone <URL_DU_REPO>
cd MSPR2EISI

# Lancer toute la stack (en cours d'implémentation)
docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| API siège | http://localhost:8000/docs |
| API Colombie | http://localhost:8001/docs |
| Mock Brésil | http://localhost:8002/docs |
| Mock Équateur | http://localhost:8003/docs |
| Mailhog (emails) | http://localhost:8025 |
| MQTT | `localhost:1883` |

> **Étape 2** : squelettes en place. Backend fonctionnel → **étape 3**.

## IoT — MicroPython (choix étape 2)

**Décision** : MicroPython sur ESP32 (WiFi natif, prototypage rapide, code Python cohérent avec FastAPI).

Voir `iot/esp32_dht22/README.md` pour le câblage DHT22 et les topics MQTT.

## Git — conventions

- Branches : `feature/<prenom>/<tache>` (ex. `feature/anis/crud-lots`)
- `main` : stable, démo-ready
- Pull request + relecture par 1 membre minimum avant merge

## Documentation

| Document | Description |
|----------|-------------|
| `docs/01_MATRICE_TRACABILITE.md` | Matrice grille ↔ livrables ↔ étapes |
| `docs/openapi/openapi-v0.yaml` | Contrat API partagé |
| `docs/schemas/architecture-globale.md` | Schémas architecture |
| `docs/04_DOSSIER_TECHNIQUE.md` | Dossier technique (en cours) |

## Licence / contexte

Projet académique EPSI — MSPR TPRE814 — FutureKawa (cas pédagogique).
