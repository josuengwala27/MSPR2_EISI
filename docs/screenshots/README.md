# Captures d'écran — FutureKawa (soutenance / doc utilisateur)

| Fichier | Vue | Usage |
|---------|-----|--------|
| `dashboard-desktop.png` | Tableau de bord — desktop 1280px | Dossier technique, soutenance |
| `dashboard-mobile.png` | Tableau de bord — iPhone 14 | Responsive mobile |
| `capteurs-desktop.png` | Surveillance capteurs — desktop | Livrable IoT client |

## Générer les captures

```powershell
cd C:\Users\josue\Documents\MSPR2EISI
docker compose up -d
npx --yes playwright@1.49.1 install chromium   # une seule fois
.\scripts\capture_frontend_screenshots.ps1
```

Les images sont enregistrées dans ce dossier.
