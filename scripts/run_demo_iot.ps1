# Lance la demo IoT complete (sans ESP32 physique)
# Equivalent : ESP32 → MQTT → backend → base → API

Write-Host "=== Demo IoT FutureKawa (donnees simulees) ===" -ForegroundColor Cyan
Write-Host ""

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "1. Demarrage Docker (stack + simulateur capteur)..." -ForegroundColor Yellow
docker compose --profile demo up -d --build

if ($LASTEXITCODE -ne 0) {
    Write-Host "Erreur docker compose" -ForegroundColor Red
    exit 1
}

Write-Host "   Attente backend..." -ForegroundColor Gray
Start-Sleep -Seconds 8

Write-Host ""
Write-Host "2. Verification API..." -ForegroundColor Yellow
try {
    $m = Invoke-RestMethod "http://localhost:8001/api/v1/mesures/dernieres?entrepot=ENT-CO-BOGOTA-01" -TimeoutSec 10
    Write-Host "   Derniere mesure : T=$($m.temperature) C | H=$($m.humidite) % | device=$($m.device_id)" -ForegroundColor Green
} catch {
    Write-Host "   API pas encore prete — attendre 30s et relancer la commande ci-dessous" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Demo active ===" -ForegroundColor Green
Write-Host "  Mesures (toutes les 60s) : http://localhost:8001/api/v1/mesures/dernieres?entrepot=ENT-CO-BOGOTA-01"
Write-Host "  Alertes                  : http://localhost:8001/api/v1/alertes"
Write-Host "  API docs                 : http://localhost:8001/docs"
Write-Host "  Emails                   : http://localhost:8025"
Write-Host ""
Write-Host "  Surveiller en direct     : .\scripts\watch_mesures.ps1"
Write-Host "  Logs simulateur          : docker compose logs -f iot-simulator"
Write-Host ""
Write-Host "  Arreter                  : docker compose --profile demo down"
Write-Host ""
Write-Host "Note : quand l'ESP32 sera branche, lancer sans --profile demo :" -ForegroundColor DarkGray
Write-Host "       docker compose up"
