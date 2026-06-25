# Matrice de traçabilité — MSPR TPRE814 FutureKawa

> **Équipe (5)** : Josué · Anis · Aziz · Rahma · Berdan  
> **Soutenance** : lundi 6 juillet  
> **Backend pays exemple** : Colombie (complet)  
> **Backends simulés** : Brésil · Équateur (mock API + jeux de données)  
> **Stack** : FastAPI · PostgreSQL · Mosquitto · React · Chart.js · ESP32 + DHT22 · Docker Compose · Jenkins (local)

---

## Légende

| Symbole | Signification |
|---------|---------------|
| ✅ | Preuve attendue le jour J |
| 📄 | Document / livrable fichier |
| 🎤 | À montrer à l'oral (20 min + entretien) |
| 🔧 | Code / démo technique |

---

## 1. Grille d'évaluation ↔ Livrables ↔ Preuves

### C1 — Collecter les besoins métiers

| Critère grille | Exigence sujet | Livrable | Preuve | Responsable |
|----------------|----------------|----------|--------|-------------|
| Interview-type + méthodologie de retranscription | Contexte métier § I + besoin phase 2 § III.6 | Dossier technique § besoins | 📄 Tableau synthèse besoins/contraintes issu du CDC | Josué |
| Questionnaire structuré | Livrable 10 | `docs/10_QUESTIONNAIRE_PHASE2.md` | 📄 🎤 Questions : objectifs auto, sécurité, maintenance, modes manuel/auto, priorités, risques | Josué |
| Besoins fonctionnels + contraintes métier | Besoins § III.1 à III.5 | Dossier technique § 1 | 📄 Matrice besoin → fonctionnalité → composant | Josué |

---

### C2 — Concevoir une architecture applicative

| Critère grille | Exigence sujet | Livrable | Preuve | Responsable |
|----------------|----------------|----------|--------|-------------|
| Critères stabilité, efficacité, pérennité argumentés | Architecture § III.5 + Fig. 1 | Dossier technique § 4.1 | 📄 🎤 Paragraphe de justification par critère | Josué |
| Environnement technique listé | Exigences globales § II | Dossier technique § 4.1 | 📄 Table stack (FastAPI, PG, Mosquitto, React…) | Josué |
| Schéma de fonctionnement | Fig. 1 infrastructure | `docs/schemas/architecture-globale.png` | 📄 🎤 Schéma pays + siège + flux MQTT/API | Josué |
| Résilience / logs / supervision | Dossier § 4.1 | Dossier technique § 4.1 | 📄 Stratégie reconnexion IoT, healthchecks Docker, logs | Josué + Berdan |

---

### C3 — Développer une application adéquate

| Critère grille | Exigence sujet | Livrable | Preuve | Responsable |
|----------------|----------------|----------|--------|-------------|
| Développement web | Frontend § III.3 | `frontend/` | 🔧 🎤 Sélection pays, liste lots FIFO, courbes | Rahma |
| Développement IoT | Livrable 3 | `iot/esp32_dht22/` | 🔧 🎤 Relevé DHT22 → MQTT → BDD → UI | Berdan |
| Backend API REST | Livrables 1 & 2 | `backend-pays-colombie/` `backend-siege/` | 🔧 🎤 CRUD lots, mesures, alertes | Anis + Aziz |
| Respect CDC + démo code | Tous besoins § III | Repo Git + soutenance | 🎤 Interpréter 2–3 extraits de code (alerte FIFO, MQTT, consolidation) | Tous |

---

### C4 — Solution applicative intégrée (ERP) — Option B

| Critère grille | Exigence sujet | Livrable | Preuve | Responsable |
|----------------|----------------|----------|--------|-------------|
| Paramétrage module / intégration | SI hybride § I.5 (ERP siège) | `backend-siege/erp_integration/` + `config/erp_mapping.yaml` | 📄 🔧 Mapping champs lot ERP ↔ API interne | Josué |
| Logique d'intégration documentée | Contexte ERP existant | Dossier technique § 4.1 (sous-partie ERP) | 📄 🎤 Schéma flux : app opérationnelle → connecteur → ERP | Josué |
| Démo technique | Oral | Soutenance | 🎤 Montrer config + endpoint export/sync + explication | Josué |

> **Note soutenance** : « L'ERP reste le système de gestion intégré au siège ; notre solution est la couche opérationnelle IoT/stocks qui l'alimente via connecteur paramétrable. »

---

### C5 — Effectuer les tests

| Critère grille | Exigence sujet | Livrable | Preuve | Responsable |
|----------------|----------------|----------|--------|-------------|
| Plan de tests (unitaire, intégration, recette) | Livrable 4.3 | `docs/04_3_PLAN_TESTS.md` | 📄 Cas de test, données, critères succès | Berdan + Anis |
| Jeux d'essai + résultats attendus | Livrable 6 | `tests/` + `docs/06_TESTS_MANUELS.md` | 📄 🔧 Commandes `pytest`, rapports | Berdan |
| Outil de testing | Grille | pytest (+ évent. Playwright/Cypress UI) | 🔧 Logs / rapport HTML pytest | Berdan |
| Gestion anomalies | Livrable 4.3 | Plan tests § anomalies | 📄 Template : constat → correction → re-test | Berdan |

---

### C6 — Intégration continue (Jenkins local)

| Critère grille | Exigence sujet | Livrable | Preuve | Responsable |
|----------------|----------------|----------|--------|-------------|
| Installation / paramétrage Jenkins | Livrable 5 | `jenkins/Jenkinsfile` + `docs/05_CI_CD.md` | 📄 🔧 Capture pipeline vert | Berdan |
| Build + tests auto | Livrable 5 | Jenkinsfile stages | 🔧 Stage test + build images Docker | Berdan |
| Packaging Docker | Livrable 5 | Jenkinsfile stage docker | 🔧 Images taguées disponibles | Berdan |
| Preuve d'exécution | Livrable 5 | `docs/05_CI_CD.md` | 📄 🎤 Screenshots historique builds | Berdan |

---

### C7 — Conformité CDC + documentation utilisateur

| Critère grille | Exigence sujet | Livrable | Preuve | Responsable |
|----------------|----------------|----------|--------|-------------|
| Comparaison réalisation vs CDC | Évaluation sujet p.8 | `docs/07_MATRICE_CONFORMITE_CDC.md` | 📄 Chaque exigence : statut Oui/Partiel + référence | Josué |
| Documentation utilisateur métier | Livrable 8 | `docs/08_GUIDE_UTILISATEUR.md` | 📄 Parcours UI, lots, courbes, alertes, FAQ | Rahma |
| Qualité rédactionnelle | Grille | Relecture équipe | 📄 | Josué |

---

### C8 — Conduite du changement

| Critère grille | Exigence sujet | Livrable | Preuve | Responsable |
|----------------|----------------|----------|--------|-------------|
| 4 axes : informer, communiquer, former, participer | Besoin § III.6 | `docs/09_PLAN_CONDUITE_CHANGEMENT.md` | 📄 Plan par axe + calendrier | Josué |
| Outils (Future Wheel, Bridges…) | Grille | Même doc § outils | 📄 🎤 Schéma Future Wheel ou courbe de deuil du changement | Josué |
| Mise en application via un outil | Grille + Livrable 9 | `docs/schemas/automatisation_phase2.png` | 📄 🎤 Schéma capteurs → décision → actionneurs | Josué + Berdan |
| Questionnaire phase 2 | Livrable 10 | `docs/10_QUESTIONNAIRE_PHASE2.md` | 📄 | Josué |

---

## 2. Cahier des charges fonctionnel ↔ Composant technique

| # | Besoin CDC | Règle métier | Composant | Responsable |
|---|------------|--------------|-----------|-------------|
| 1 | Gestion lots multi-pays | ID unique, pays, entrepôt, date stockage, statut | `backend-pays-colombie` API `/lots` + PostgreSQL | Anis |
| 2 | FIFO | Tri par `date_stockage` ASC | API + Frontend liste lots | Anis + Rahma |
| 3 | IoT temp/humidité | DHT22 → MQTT local | `iot/esp32_dht22` + Mosquitto | Berdan |
| 4 | Seuils Colombie | 26 °C / 80 %, tol. ±3 °C / ±2 % | `config/thresholds.yaml` + service alertes | Anis |
| 5 | Historique mesures | Persistance SQL + courbes | Table `mesures` + API + Chart.js | Anis + Rahma |
| 6 | Alerte hors plage | Email resp. exploitation pays | Service alerting + SMTP (Mailhog démo) | Berdan |
| 7 | Alerte péremption | Lot > 365 jours | Cron/job quotidien backend pays | Anis |
| 8 | Archi distribuée | Backend local conteneurisé par pays | `docker-compose.yml` pays | Berdan |
| 9 | Consolidation siège | Interroger APIs pays | `backend-siege` agrégateur | Aziz |
| 10 | Vue centralisée | Frontend siège | `frontend/` | Rahma |
| 11 | Mocks Brésil/Équateur | 3 pays visibles au siège | `mocks/backends-br-ec/` ou fixtures | Aziz |
| 12 | Doc alerting | Règles, seuils, fréquence, emails | `docs/ALERTING.md` | Berdan |

### Seuils par pays (référence implémentation)

| Pays | T° cible | Hum. cible | Plage T° | Plage hum. | Backend |
|------|----------|------------|----------|------------|---------|
| **Colombie** | 26 °C | 80 % | 23–29 °C | 78–82 % | **Complet** |
| Brésil | 29 °C | 55 % | 26–32 °C | 53–57 % | Mock |
| Équateur | 31 °C | 60 % | 28–34 °C | 58–62 % | Mock |

---

## 3. Les 10 livrables officiels — checklist

| # | Livrable sujet | Chemin projet | Statut | Responsable |
|---|----------------|---------------|--------|-------------|
| 1 | Backend pays exemple conteneurisé | `backend-pays-colombie/` + `docker-compose.yml` | ✅ | Anis + Berdan |
| 2 | Backend siège + Frontend | `backend-siege/` + `frontend/` | ⬜ | Aziz + Rahma |
| 3 | Prototype IoT fonctionnel | `iot/esp32_dht22/` | ⬜ | Berdan |
| 4 | Dossier technique argumenté | `docs/04_DOSSIER_TECHNIQUE.md` | ⬜ | Josué (+ tous) |
| 5 | Pipelines CI/CD Jenkins | `jenkins/` | ⬜ | Berdan |
| 6 | Tests manuels lançables | `docs/06_TESTS_MANUELS.md` | ⬜ | Berdan |
| 7 | Code source Git | Repo complet + `README.md` | 🔄 poussé, à cloner par l'équipe | Tous |
| 8 | Documentation utilisateur | `docs/08_GUIDE_UTILISATEUR.md` | ⬜ | Rahma |
| 9 | Schéma automatisation phase 2 | `docs/schemas/automatisation_phase2.png` | ⬜ | Josué |
| 10 | Questionnaire phase 2 | `docs/10_QUESTIONNAIRE_PHASE2.md` | ⬜ | Josué |
| + | Support soutenance | `presentation/` | ⬜ | Josué (+ tous) |

---

## 4. Répartition des rôles validée

| Membre | Périmètre principal | Livrables clés |
|--------|---------------------|----------------|
| **Josué** | Chef de projet, architecture, ERP (option B), conformité CDC, conduite changement, cohérence globale | Docs 4.1, 7, 9, 10, matrice conformité, slides |
| **Anis** | Backend pays **Colombie** : API FastAPI, PostgreSQL, logique lots/FIFO/alertes métier | Livrable 1 |
| **Aziz** | Backend **siège** : consolidation 3 pays, mocks BR/EC, routes agrégées | Livrable 2 (backend) |
| **Rahma** | **Frontend** React + Chart.js : UX terrain + siège | Livrable 2 (frontend) + doc utilisateur |
| **Berdan** | **IoT** ESP32/DHT22, MQTT, Docker Compose, **Jenkins** local, tests | Livrables 3, 5, 6 |

### Règles d'équipe

- **Git** : branches `feature/<prenom>/<tache>`, PR revue par 1 autre membre minimum
- **API** : contrat OpenAPI partagé avant dev frontend (Aziz + Anis → Rahma)
- **Démo** : scénario unique documenté dans `README.md` (chemin critique jour J)

---

## 5. Scénario de démonstration (jour J)

1. `docker compose up` → stack Colombie + siège + mocks BR/EC + Mailhog
2. ESP32 publie temp/humidité MQTT (ou simulateur si souci matériel)
3. Frontend : sélection **Colombie** → lots triés FIFO → détail lot → courbes
4. Injection mesure hors plage → alerte + email visible (Mailhog)
5. Vue siège : bascule Brésil / Équateur (données mock)
6. Export ERP : déclenchement sync + affichage mapping
7. Jenkins : montrer dernier build vert
8. IoT : schéma câblage DHT22 + topic MQTT

---

## 6. Stack technique figée

```
┌─────────────────────────────────────────────────────────┐
│  ESP32 + DHT22  ──MQTT──►  Mosquitto  ──►  FastAPI (CO) │
│                                    │         │          │
│                                    │         ▼          │
│                                    │    PostgreSQL      │
│                                    │         │          │
│  FastAPI (siège) ◄──REST── mocks BR/EC + API Colombie   │
│        │                                                │
│        ▼                                                │
│  React + Chart.js          Jenkins (local) + pytest     │
│  Mailhog (SMTP démo)       Docker Compose               │
└─────────────────────────────────────────────────────────┘
```

| Couche | Choix | Justification |
|--------|-------|---------------|
| Backend | **FastAPI** | Maîtrise équipe, OpenAPI natif, async |
| BDD | **PostgreSQL** | Exigence SQL, référencé sujet |
| MQTT | **Mosquitto** (eclipse-mosquitto) | Exigence sujet |
| Frontend | **React** + **Chart.js** | Référencé sujet |
| IoT | **ESP32** + **DHT22** | Matériel équipe + sujet |
| IoT langage | **MicroPython** | Choix étape 2 — WiFi natif, cohérence Python |
| Email démo | **Mailhog** | Pas de SMTP prod nécessaire |
| CI | **Jenkins** local + Docker | Exigence sujet |
| ERP | **Option B** — connecteur + YAML mapping | Pas de SAP |

---

## 7. Plan méthodique complet — toutes les étapes

> **Règle d'or** : on ne passe à l'étape **N+1** que si l'étape **N** est validée par l'équipe (case « Validé » cochée).  
> **Soutenance** : lundi **6 juillet** · **Aujourd'hui** : 18 juin → **18 jours** de travail projet (hors 24 h de préparation MSPR le jour J).

### Légende statuts

| Symbole | Signification |
|---------|---------------|
| ✅ | Terminé et validé |
| 🔄 | En cours |
| ⬜ | À faire |
| 🚫 | Bloqué (noter la raison) |

### Vue d'ensemble

| Étape | Intitulé | Période cible | Statut | Responsable lead |
|-------|----------|---------------|--------|------------------|
| **0** | Cadrage projet | 18 juin | ✅ | Josué |
| **0bis** | Stratégie C4 ERP (option B) | 18 juin | ✅ | Josué |
| **1** | Matrice de traçabilité | 18 juin | ✅ | Josué |
| **2** | Architecture + repo Git | 19–20 juin | ✅ | Josué |
| **3** | Backend pays Colombie | 21–24 juin | ✅ | Anis |
| **4** | Module IoT ESP32 + DHT22 | 23–25 juin | ⬜ | Berdan |
| **5** | Alertes + emails | 25–26 juin | ⬜ | Berdan + Anis |
| **6** | Backend siège + mocks BR/EC | 26–28 juin | ⬜ | Aziz |
| **7** | Frontend React + Chart.js | 27–30 juin | ⬜ | Rahma |
| **8** | Intégration ERP (option B) | 30 juin – 1 juil. | ⬜ | Josué |
| **9** | Tests + Jenkins CI/CD | 1–3 juillet | ⬜ | Berdan |
| **10** | Documentation complète | 2–4 juillet | ⬜ | Josué (+ tous) |
| **11** | Répétition soutenance | 5 juillet | ⬜ | Tous |
| **12** | Soutenance MSPR | **6 juillet** | ⬜ | Tous |

---

### Étape 0 — Cadrage projet ✅

| Élément | Détail |
|---------|--------|
| **Objectif** | Comprendre le sujet, la grille, fixer les choix structurants |
| **Compétences grille** | Préparation globale |
| **Tâches** | |
| | ✅ Analyser sujet MSPR TPRE814 (CDC complet) |
| | ✅ Analyser grille Bloc 4 (8 compétences) |
| | ✅ Identifier l'écart C4 ERP → décision option B |
| | ✅ Fixer équipe (5), stack, pays exemple (Colombie) |
| | ✅ Valider répartition des rôles |
| **Livrables** | Fiche de cadrage (dans cette matrice, § en-tête) |
| **Critère de validation** | Toute l'équipe alignée sur stack, rôles, pays, date soutenance |
| **Statut** | ✅ Validé |

---

### Étape 0bis — Stratégie C4 ERP (option B) ✅

| Élément | Détail |
|---------|--------|
| **Objectif** | Couvrir la compétence progiciel sans développement SAP |
| **Compétences grille** | **C4** (préparation) |
| **Tâches** | |
| | ✅ Décision : intégration ERP via connecteur + mapping YAML |
| | ⬜ (Optionnel) Question écrite à l'encadrant — conserver la réponse si obtenue |
| | ⬜ Préparer argumentaire oral (cf. note § C4) |
| **Livrables** | Stratégie documentée § C4 de cette matrice |
| **Critère de validation** | L'équipe sait expliquer l'option B en 2 min à l'oral |
| **Statut** | ✅ Validé (implémentation réelle → étape 8) |

---

### Étape 1 — Matrice de traçabilité ✅

| Élément | Détail |
|---------|--------|
| **Objectif** | Aucun oubli grille ↔ CDC ↔ livrables ↔ preuves |
| **Compétences grille** | Toutes (cadre global) |
| **Tâches** | |
| | ✅ Matrice 8 compétences → livrables → preuves |
| | ✅ Checklist 10 livrables officiels |
| | ✅ Plan méthodique complet (cette section § 7) |
| | ✅ Scénario démo jour J |
| **Livrables** | `docs/01_MATRICE_TRACABILITE.md` |
| **Critère de validation** | Chaque compétence C1–C8 a au moins une preuve identifiée |
| **Statut** | ✅ Validé |

---

### Étape 2 — Architecture + repo Git

| Élément | Détail |
|---------|--------|
| **Objectif** | Poser les fondations techniques avant tout développement |
| **Période** | 19–20 juin |
| **Compétences grille** | **C2** |
| **Responsable** | Josué (lead) · tous pour init Git |

**Tâches détaillées**

- [x] Créer le dépôt Git (structure monorepo)
- [x] Arborescence : `backend-pays-colombie/` · `backend-siege/` · `frontend/` · `iot/` · `mocks/` · `docs/` · `jenkins/` · `config/`
- [x] Schéma architecture globale → `docs/schemas/architecture-globale.md` (Mermaid, export PNG pour soutenance)
- [x] Schéma flux de données (IoT → MQTT → API → siège → UI)
- [x] Contrat **OpenAPI v0** : endpoints lots, mesures, alertes, pays
- [x] `config/thresholds.yaml` (seuils 3 pays)
- [x] `README.md` : prérequis, structure, commandes de base
- [x] `.gitignore`, conventions branches (`feature/<prenom>/<tache>`)
- [x] Trancher **MicroPython** vs Arduino pour ESP32 → **MicroPython** (cf. README + `iot/esp32_dht22/`)
- [x] Démarrer `docs/04_DOSSIER_TECHNIQUE.md` § 4.1 (ébauche architecture)
- [x] `docker-compose.yml` squelette (stack démo)
- [x] Squelettes FastAPI pays + siège + mocks (`/api/v1/health`)

**Livrables produits**

| Fichier / dossier | Responsable |
|-------------------|-------------|
| Structure repo + README | Josué |
| `docs/schemas/architecture-globale.png` | Josué |
| `docs/openapi/openapi-v0.yaml` | Anis + Aziz |
| `config/thresholds.yaml` | Anis |

**Critère de validation (gate)**

- [x] Repo initialisé (`git init`) — poussé sur https://github.com/josuengwala27/MSPR2_EISI
- [x] Schéma architecture relu et approuvé par l'équipe
- [x] OpenAPI v0 partagé → Rahma peut démarrer le frontend en étape 7

**Statut** : ✅ Validé le 19 juin

---

### Étape 3 — Backend pays Colombie

| Élément | Détail |
|---------|--------|
| **Objectif** | Livrable 1 : backend local complet, conteneurisé, reproductible |
| **Période** | 21–24 juin |
| **Compétences grille** | **C3**, **C2** |
| **Responsable** | Anis (lead) · Berdan (Docker) |

**Tâches détaillées**

- [x] Modèle SQL : tables `lots`, `mesures`, `alertes`, `entrepots`
- [x] API FastAPI : CRUD lots (ID unique, pays, entrepôt, date stockage, statut)
- [x] Tri FIFO : endpoint liste lots par `date_stockage` ASC
- [x] Endpoint consultation mesures par lot (historique)
- [x] Subscriber MQTT : réception temp/humidité → persistance SQL
- [x] Logique statut lot (conforme / alerte / périmé)
- [x] `Dockerfile` backend pays
- [x] `docker-compose.yml` : FastAPI + PostgreSQL + Mosquitto
- [x] Commande unique : `docker compose up` (dossier pays)
- [x] Jeux de données de démo (lots colombiens)
- [x] Documentation lancement → `backend-pays-colombie/README.md`
- [x] `docs/ALERTING.md` (regles alertes + emails Mailhog)

**Livrables produits**

| Livrable sujet # | Fichier |
|------------------|---------|
| **Livrable 1** | `backend-pays-colombie/` + `docker-compose.yml` |

**Critère de validation (gate)**

- [x] `docker compose up` → API accessible (Swagger `/docs`)
- [x] CRUD lot fonctionnel + tri FIFO vérifiable
- [x] Message MQTT test → mesure en base
- [ ] Reproductible sur le poste d'au moins 2 membres de l'équipe

**Statut** : ✅ Validé technique le 19 juin — gate equipe 2 postes en attente

---

### Étape 4 — Module IoT ESP32 + DHT22

| Élément | Détail |
|---------|--------|
| **Objectif** | Livrable 3 : prototype opérationnel capteur → MQTT → backend |
| **Période** | 23–25 juin (chevauche étape 3) |
| **Compétences grille** | **C3**, **C2** (§ 4.2 IoT) |
| **Responsable** | Berdan |

**Tâches détaillées**

- [x] Câblage DHT22 ↔ ESP32 (documenter pinout) → `docs/schemas/cablage-esp32-dht22.md`
- [x] Code firmware : lecture DHT22 + publication MQTT périodique → `iot/esp32_dht22/main.py`
- [x] Topics MQTT : `futurekawa/co/ent-co-bogota-01/mesures` (aligné `config/iot.yaml`)
- [x] Format payload JSON (temp, humidity, timestamp, device_id)
- [x] Stratégie reconnexion WiFi / MQTT
- [x] Test bout-en-bout : simulateur → Mosquitto → FastAPI → PostgreSQL (ESP32 = test matériel Berdan)
- [x] Simulateur MQTT → `iot/mqtt-simulator/simulate.py`
- [x] Schéma câblage → `docs/schemas/cablage-esp32-dht22.md` (PNG export soutenance)
- [x] Rédiger dossier technique § 4.2 (conception IoT)

**Livrables produits**

| Livrable sujet # | Fichier |
|------------------|---------|
| **Livrable 3** | `iot/esp32_dht22/` |
| Dossier tech § 4.2 | `docs/04_DOSSIER_TECHNIQUE.md` |
| Schéma câblage | `docs/schemas/cablage-esp32-dht22.md` |

**Critère de validation (gate)**

- [x] Relevé visible dans la base ou l'API (via simulateur ; ESP32 en attente test Berdan)
- [x] Scénario reproductible documenté (avec ou sans hardware)
- [x] Topics et payload documentés

**Statut** : ✅ code + demo simulateur | ⬜ test materiel ESP32 (a faire plus tard)

---

### Étape 5 — Alertes + emails

| Élément | Détail |
|---------|--------|
| **Objectif** | Règles d'alerte automatiques + notification email (CDC § III.4) |
| **Période** | 25–26 juin |
| **Compétences grille** | **C3**, **C5** (cas de test alertes) |
| **Responsable** | Berdan (email/infra) · Anis (règles métier) |

**Tâches détaillées**

- [x] Règle 1 : température ou humidité hors plage Colombie (23–29 °C / 78–82 %)
- [x] Règle 2 : lot en stockage > 365 jours → alerte péremption
- [x] Job périodique vérification seuils + péremption (scheduler APScheduler)
- [x] Envoi email au responsable exploitation Colombie
- [x] Mailhog en Docker pour démo (capture emails sans SMTP prod)
- [x] Mise à jour statut lot → `alerte` / `perime`
- [x] Rédiger `docs/ALERTING.md` : règles, seuils, fréquence, contenu emails
- [x] Cas de test alertes → `scripts/test_etape5.ps1`

**Livrables produits**

| Fichier | Contenu |
|---------|---------|
| `docs/ALERTING.md` | Documentation alerting complète |
| Service alerting | `backend-pays-colombie/app/services/alert_service.py` |
| Mailhog | Dans `docker-compose.yml` |
| Test etape 5 | `scripts/test_etape5.ps1` |

**Critère de validation (gate)**

- [x] Mesure hors plage injectée → alerte en base + email dans Mailhog
- [x] Lot > 365 jours → alerte péremption déclenchée
- [x] `docs/ALERTING.md` + script de test

**Statut** : ✅

---

### Étape 6 — Backend siège + mocks Brésil / Équateur

| Élément | Détail |
|---------|--------|
| **Objectif** | Consolidation multi-pays : 1 pays réel + 2 mocks (CDC § III.5) |
| **Période** | 26–28 juin |
| **Compétences grille** | **C2**, **C3** |
| **Responsable** | Aziz |

**Tâches détaillées**

- [x] API FastAPI siège : agrégation stocks / mesures / alertes
- [x] Client HTTP vers API Colombie (réelle)
- [x] Mocks Brésil + Équateur : `mocks/backends-br-ec/` (FastAPI + fixtures)
- [x] Jeux de données BR (29 °C / 55 %) et EC (31 °C / 60 %)
- [x] Endpoints siège : liste pays, stocks consolidés, alertes consolidées
- [x] Gestion indisponibilité pays (timeout, HTTP 502)
- [x] `docker-compose.yml` racine : orchestration pays + siège + mocks
- [x] OpenAPI siège aligné (`docs/openapi/openapi-v0.yaml`)
- [x] Script test `scripts/test_etape6.ps1`

**Livrables produits**

| Livrable sujet # | Fichier |
|------------------|---------|
| **Livrable 2** (partie backend) | `backend-siege/` + `mocks/` |

**Critère de validation (gate)**

- [x] Siège retourne données des 3 pays
- [x] Colombie = données live ; BR/EC = mocks crédibles
- [x] Panne simulée mock → siège gère l'erreur sans crash (502)

**Statut** : ✅

---

### Étape 7 — Frontend React + Chart.js

| Élément | Détail |
|---------|--------|
| **Objectif** | Interface web complète (CDC § III.3) — Livrable 2 (partie frontend) |
| **Période** | 27–30 juin |
| **Compétences grille** | **C3**, **C7** (base UI pour doc utilisateur) |
| **Responsable** | Rahma |

**Tâches détaillées**

- [x] Setup React (Vite) + Chart.js + TypeScript + Tailwind
- [x] Écran sélection pays / exploitation
- [x] Liste lots triés par date de stockage (FIFO visuel)
- [x] Fiche lot : statut, détail, indicateurs alerte
- [x] Courbes température + humidité (historique depuis stockage)
- [x] Vue alertes : liste + filtres par pays
- [x] UX premium responsive (desktop / tablette / mobile)
- [x] Connexion API siège (VITE_API_URL)
- [x] Dockerfile frontend + nginx + docker-compose
- [ ] Captures d'écran pour doc utilisateur (étape 10)

**Livrables produits**

| Livrable sujet # | Fichier |
|------------------|---------|
| **Livrable 2** (partie frontend) | `frontend/` |

**Critère de validation (gate)**

- [x] Parcours complet : pays → lots → lot → courbes → alertes
- [x] Données Colombie live + BR/EC mock affichées correctement
- [x] Script test `scripts/test_etape7.ps1`
- [ ] Testé sur navigateur de 2 membres minimum

**Statut** : ✅

---

### Étape 8 — Intégration ERP (option B)

| Élément | Détail |
|---------|--------|
| **Objectif** | Couvrir **C4** : connecteur paramétrable vers ERP siège |
| **Période** | 30 juin – 1 juillet |
| **Compétences grille** | **C4** |
| **Responsable** | Josué |

**Tâches détaillées**

- [ ] `config/erp_mapping.yaml` : mapping champs lot (ERP ↔ API interne)
- [ ] Module `backend-siege/erp_integration/` : export / sync
- [ ] Endpoint déclenchement sync (ex. `POST /erp/sync`)
- [ ] Format export : JSON ou CSV (documenter)
- [ ] Schéma flux ERP → `docs/schemas/integration-erp.png`
- [ ] Section ERP dans dossier technique § 4.1
- [ ] Préparer démo oral : config + code connecteur (10–15 lignes commentées)
- [ ] Cas de test intégration ERP → pour étape 9

**Livrables produits**

| Fichier | Contenu |
|---------|---------|
| `config/erp_mapping.yaml` | Paramétrage intégration |
| `backend-siege/erp_integration/` | Connecteur |
| `docs/schemas/integration-erp.png` | Schéma flux |
| Dossier tech § 4.1 ERP | Argumentaire + positionnement SI hybride |

**Critère de validation (gate)**

- [ ] Sync déclenchable en démo avec résultat visible (log ou fichier export)
- [ ] L'équipe peut expliquer C4 en 3 min sans mentionner SAP

**Statut** : ⬜

---

### Étape 9 — Tests + Jenkins CI/CD

| Élément | Détail |
|---------|--------|
| **Objectif** | Livrables 5 & 6 + compétences **C5** et **C6** |
| **Période** | 1–3 juillet |
| **Compétences grille** | **C5**, **C6** |
| **Responsable** | Berdan (lead) · Anis (tests API) |

**Tâches détaillées**

- [ ] Rédiger `docs/04_3_PLAN_TESTS.md` (stratégie, typologie, cas, critères succès)
- [ ] Tests unitaires backend pays (pytest) : lots, FIFO, seuils, péremption
- [ ] Tests intégration API (httpx/TestClient FastAPI)
- [ ] Tests alertes (mesure hors plage, lot périmé)
- [ ] Tests siège (agrégation 3 pays, mock down)
- [ ] Tests ERP connecteur
- [ ] `docs/06_TESTS_MANUELS.md` : commandes, prérequis, jeux de données, résultats attendus
- [ ] Installer Jenkins en local (Docker ou natif)
- [ ] `jenkins/Jenkinsfile` : checkout → test → build → docker build
- [ ] `docs/05_CI_CD.md` : installation Jenkins + captures pipeline vert
- [ ] Template gestion anomalies dans plan de tests
- [ ] (Optionnel) Tests UI frontend

**Livrables produits**

| Livrable sujet # | Fichier |
|------------------|---------|
| **Livrable 4.3** | `docs/04_3_PLAN_TESTS.md` |
| **Livrable 5** | `jenkins/Jenkinsfile` + `docs/05_CI_CD.md` |
| **Livrable 6** | `docs/06_TESTS_MANUELS.md` + `tests/` |

**Critère de validation (gate)**

- [ ] `pytest` passe en local avec commande documentée
- [ ] Pipeline Jenkins exécuté au moins 1 fois avec succès (capture d'écran)
- [ ] Plan de tests couvre : unitaire, intégration, API, alertes, bout-en-bout minimal

**Statut** : ⬜

---

### Étape 10 — Documentation complète

| Élément | Détail |
|---------|--------|
| **Objectif** | Tous les livrables documentaires + conformité CDC |
| **Période** | 2–4 juillet |
| **Compétences grille** | **C1**, **C7**, **C8** |
| **Responsable** | Josué (coordination) · chacun sa partie |

**Tâches détaillées**

| Tâche | Fichier | Responsable |
|-------|---------|-------------|
| Finaliser dossier technique | `docs/04_DOSSIER_TECHNIQUE.md` | Josué (+ tous) |
| § 4.1 Architecture globale + ERP + robustesse | idem | Josué |
| § 4.2 Conception IoT | idem | Berdan |
| § 4.3 Plans de tests (sync étape 9) | `docs/04_3_PLAN_TESTS.md` | Berdan |
| Matrice conformité CDC | `docs/07_MATRICE_CONFORMITE_CDC.md` | Josué |
| Guide utilisateur métier | `docs/08_GUIDE_UTILISATEUR.md` | Rahma |
| Plan conduite du changement | `docs/09_PLAN_CONDUITE_CHANGEMENT.md` | Josué |
| Schéma automatisation phase 2 | `docs/schemas/automatisation_phase2.png` | Josué + Berdan |
| Questionnaire interview phase 2 | `docs/10_QUESTIONNAIRE_PHASE2.md` | Josué |
| README racine finalisé | `README.md` | Josué |
| Relecture orthographe / cohérence | Tous docs | Tous |

**Livrables produits**

| Livrable sujet # | Document |
|------------------|----------|
| **Livrable 4** | `docs/04_DOSSIER_TECHNIQUE.md` |
| **Livrable 7** | Repo Git complet |
| **Livrable 8** | `docs/08_GUIDE_UTILISATEUR.md` |
| **Livrable 9** | `docs/schemas/automatisation_phase2.png` |
| **Livrable 10** | `docs/10_QUESTIONNAIRE_PHASE2.md` |
| **C7** | `docs/07_MATRICE_CONFORMITE_CDC.md` |
| **C8** | `docs/09_PLAN_CONDUITE_CHANGEMENT.md` |

**Critère de validation (gate)**

- [ ] Chaque exigence CDC a une ligne dans la matrice conformité (Oui / Partiel + référence)
- [ ] Dossier technique relu par au moins 2 membres
- [ ] Guide utilisateur testé par quelqu'un qui n'a pas codé le frontend

**Statut** : ⬜

---

### Étape 11 — Répétition soutenance

| Élément | Détail |
|---------|--------|
| **Objectif** | Être prêts pour 20 min présentation + 30 min entretien |
| **Période** | **5 juillet** (veille) |
| **Compétences grille** | **Toutes C1–C8** à l'oral |
| **Responsable** | Josué (slides) · tous (présence oral) |

**Tâches détaillées**

- [ ] Support présentation → `presentation/MSPR_FutureKawa.pptx` (ou PDF)
- [ ] Structure 20 min : contexte → archi → démo → tests/CI → ERP → changement → conclusion
- [ ] Scénario démo chronométré (cf. § 5) — max 8–10 min de démo live
- [ ] Chaque membre prépare réponse sur sa partie + 2 extraits de code à interpréter
- [ ] Préparer réponses jury : FIFO, seuils par pays, MQTT, C4 ERP, résilience, phase 2
- [ ] Répétition chronométrée #1 (5 juil. matin)
- [ ] Répétition chronométrée #2 (5 juil. après-midi) avec questions croisées
- [ ] Vérifier matériel : ESP32 chargé, Docker up en < 3 min, Jenkins accessible
- [ ] Plan B si WiFi / matériel tombe (simulateur MQTT, captures vidéo)

**Livrables produits**

| Livrable | Fichier |
|----------|---------|
| Support soutenance | `presentation/` |
| Fiche questions / réponses jury | `docs/11_FAQ_JURY.md` (optionnel) |

**Critère de validation (gate)**

- [ ] Répétition ≤ 20 min de présentation (hors questions)
- [ ] Démo complète sans blocage sur 2 essais consécutifs
- [ ] Chaque compétence C1–C8 mentionnée au moins une fois dans le support

**Statut** : ⬜

---

### Étape 12 — Soutenance MSPR (jour J)

| Élément | Détail |
|---------|--------|
| **Date** | **Lundi 6 juillet** |
| **Format** | 20 min présentation collective + 30 min entretien collectif |
| **Jury** | 2 professionnels (inconnus, n'ont pas suivi votre formation) |
| **Préparation MSPR** | 24 h (travail d'équipe, selon consignes EPSI) |

**Déroulé officiel**

| Phase | Durée | Contenu |
|-------|-------|---------|
| Présentation orale | 20 min | Support + démo technique (public technique / client FutureKawa) |
| Entretien collectif | 30 min | Questions jury : technique, grille, justifications, code |

**Checklist veille de soutenance**

- [ ] `docker compose up` testé le matin
- [ ] ESP32 ou simulateur prêt
- [ ] Jenkins : dernier build visible
- [ ] Repo Git à jour, README à jour
- [ ] Tous les livrables accessibles (clé USB / lien repo si demandé)
- [ ] Matrice conformité CDC imprimée ou accessible (pour Josué)

**Axes d'évaluation jury (sujet p.8)**

1. Qualité du travail réalisé
2. Pertinence et exhaustivité des livrables
3. Capacité à présenter, justifier et valoriser le travail

**Statut** : ⬜

---

### Synthèse : étapes ↔ compétences grille

| Étape | C1 | C2 | C3 | C4 | C5 | C6 | C7 | C8 |
|-------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 0 Cadrage | | | | | | | | |
| 0bis ERP | | | | ● | | | | |
| 1 Matrice | ● | ● | ● | ● | ● | ● | ● | ● |
| 2 Architecture | | ● | | | | | | |
| 3 Backend CO | | ● | ● | | | | | |
| 4 IoT | | ● | ● | | | | | |
| 5 Alertes | | | ● | | ● | | | |
| 6 Siège | | ● | ● | | | | | |
| 7 Frontend | | | ● | | | | ● | |
| 8 ERP | | | | ● | | | | |
| 9 Tests/CI | | | | | ● | ● | | |
| 10 Docs | ● | | | | | | ● | ● |
| 11–12 Oral | ● | ● | ● | ● | ● | ● | ● | ● |

---

### Suivi hebdomadaire (à remplir en réunion d'équipe)

| Date | Étape en cours | Bloquants | Décisions | Prochaine action |
|------|----------------|-----------|-----------|------------------|
| 18 juin | 1 ✅ | — | Stack + rôles + Colombie validés | Démarrer étape 2 |
| 18 juin | 2 🔄 | Remote Git à créer | MicroPython · OpenAPI v0 · monorepo · paramètres IoT/alertes figés | Pousser repo · valider étape 2 |
| 19 juin | 3 ✅ | — | Backend CO complet : lots FIFO, MQTT, alertes, Mailhog | Etape 4 IoT Berdan · equipe clone + test |
| 19 juin | 4 ✅ | — | Firmware ESP32, simulateur MQTT, cablage, dossier § 4.2 | Test hardware Berdan · Etape 5/6 |
| 25 juin | 5 ✅ | — | Alertes conditions + peremption, emails Mailhog, test_etape5.ps1 | Etape 6 backend siege Aziz |
| 25 juin | 6 ✅ | — | Siege multi-pays, mocks BR/EC, test_etape6.ps1 | Etape 7 frontend Rahma |
| 25 juin | 7 ✅ | — | Frontend React premium responsive, Chart.js, Docker | Etape 8 ERP Josue |

---

*Document vivant — mettre à jour les statuts ⬜ → 🔄 → ✅ au fur et à mesure.*
