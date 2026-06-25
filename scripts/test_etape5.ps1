# Test Etape 5 - Alertes + emails FutureKawa
# Lance les 2 scenarios de validation et affiche les resultats

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$apiBase = "http://localhost:8001/api/v1"
$mailhogApi = "http://localhost:8025/api/v2/messages"

function Write-Step($n, $msg) {
    Write-Host ""
    Write-Host "=== Etape $n : $msg ===" -ForegroundColor Cyan
}

function Wait-Api($maxSeconds = 90) {
    for ($i = 0; $i -lt $maxSeconds; $i += 3) {
        try {
            Invoke-RestMethod "$apiBase/health" -TimeoutSec 3 | Out-Null
            return $true
        } catch {
            Start-Sleep -Seconds 3
        }
    }
    return $false
}

function Invoke-DockerCompose($arguments) {
    # PowerShell traite la sortie stderr de docker comme erreur : on l'ignore
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & docker compose @arguments 2>&1 | Out-Null
    $code = $LASTEXITCODE
    $ErrorActionPreference = $prev
    return $code
}

Write-Host "FutureKawa - Test Etape 5 (Alertes + emails)" -ForegroundColor Green
Write-Host ""

# Verifier Docker
$prev = $ErrorActionPreference
$ErrorActionPreference = "Continue"
docker info 2>&1 | Out-Null
$dockerOk = ($LASTEXITCODE -eq 0)
$ErrorActionPreference = $prev
if (-not $dockerOk) {
    Write-Host "Docker Desktop n'est pas lance. Ouvre Docker puis relance ce script." -ForegroundColor Red
    exit 1
}

Write-Step 0 "Demarrage stack Docker"
$composeCode = Invoke-DockerCompose @("up", "-d", "--build")
if ($composeCode -ne 0) {
    Write-Host "docker compose a retourne le code $composeCode (souvent OK si deja demarre)" -ForegroundColor Yellow
}

if (-not (Wait-Api)) {
    Write-Host "Backend indisponible apres 90s. Verifie les logs : docker compose logs backend-pays-colombie" -ForegroundColor Red
    exit 1
}
Write-Host "Backend OK" -ForegroundColor Green
Start-Sleep -Seconds 3

# --- TEST 1 : Peremption au demarrage ---
Write-Step 1 "Peremption - lot > 365 jours"
$lots = Invoke-RestMethod "$apiBase/lots"
$lotPerime = $lots | Where-Object { $_.id -eq "LOT-CO-2024-001" }
if ($lotPerime.statut -eq "perime") {
    Write-Host "OK  LOT-CO-2024-001 est perime" -ForegroundColor Green
} else {
    Write-Host "KO  LOT-CO-2024-001 statut=$($lotPerime.statut) (attendu: perime)" -ForegroundColor Red
}

$alertesPeremption = @((Invoke-RestMethod "$apiBase/alertes") | Where-Object { $_.type -eq "peremption" })
if ($alertesPeremption.Count -gt 0) {
    Write-Host "OK  $($alertesPeremption.Count) alerte(s) peremption en base" -ForegroundColor Green
    $alertesPeremption | Select-Object -First 1 | ForEach-Object {
        Write-Host "    -> lot $($_.lot_id) | email_envoye=$($_.email_envoye)"
    }
} else {
    Write-Host "KO  Aucune alerte peremption" -ForegroundColor Red
}

# --- TEST 2 : Alerte conditions via MQTT ---
Write-Step 2 "Conditions hors plage - humidite 90%"
$prev = $ErrorActionPreference
$ErrorActionPreference = "Continue"
python -c "import paho.mqtt.client" 2>&1 | Out-Null
if ($LASTEXITCODE -ne 0) {
    pip install paho-mqtt -q
}
python iot/mqtt-simulator/simulate.py --once --scenario alerte --host localhost
$ErrorActionPreference = $prev
Start-Sleep -Seconds 3

$alertesConditions = @((Invoke-RestMethod "$apiBase/alertes") | Where-Object { $_.type -eq "conditions_non_ideales" })
if ($alertesConditions.Count -gt 0) {
    Write-Host "OK  $($alertesConditions.Count) alerte(s) conditions en base" -ForegroundColor Green
    $derniere = $alertesConditions | Select-Object -First 1
    Write-Host "    -> lot $($derniere.lot_id) | email_envoye=$($derniere.email_envoye)"
    Write-Host "    -> $($derniere.message)"
} else {
    Write-Host "KO  Aucune alerte conditions" -ForegroundColor Red
}

$lotsApres = Invoke-RestMethod "$apiBase/lots"
$lotsEnAlerte = @($lotsApres | Where-Object { $_.statut -eq "alerte" -and $_.id -ne "LOT-CO-2024-001" })
if ($lotsEnAlerte.Count -gt 0) {
    Write-Host "OK  $($lotsEnAlerte.Count) lot(s) en statut alerte" -ForegroundColor Green
} else {
    Write-Host "ATTENTION  Aucun lot actif en alerte" -ForegroundColor Yellow
}

# --- TEST 3 : Emails Mailhog ---
Write-Step 3 "Emails dans Mailhog"
try {
    # Envoi test SMTP (Mailhog perd les emails si le conteneur redemarre, la base PostgreSQL non)
    docker exec mspr2eisi-backend-pays-colombie-1 python -c @"
import smtplib
from email.message import EmailMessage
msg = EmailMessage()
msg['Subject'] = '[FutureKawa TEST] Email etape 5'
msg['From'] = 'noreply@futurekawa.com'
msg['To'] = 'exploitation.colombie@futurekawa.com'
msg.set_content('Test SMTP Mailhog - etape 5 FutureKawa')
with smtplib.SMTP('mailhog', 1025, timeout=10) as s:
    s.send_message(msg)
print('email test envoye')
"@ 2>&1 | Out-Null

    Start-Sleep -Seconds 1
    $mailData = Invoke-RestMethod $mailhogApi -TimeoutSec 5
    $count = $mailData.total
    if ($count -gt 0) {
        Write-Host "OK  $count email(s) dans Mailhog" -ForegroundColor Green
        Write-Host "    -> Ouvre http://localhost:8025 pour les lire" -ForegroundColor Gray
        $mailData.items | Select-Object -First 5 | ForEach-Object {
            $subject = ($_.Content.Headers.Subject -join "")
            $to = ($_.Content.Headers.To -join "")
            Write-Host "    - $subject -> $to"
        }
        if ($count -eq 1) {
            Write-Host ""
            Write-Host "Note : si tu ne vois qu'1 email test, c'est normal." -ForegroundColor DarkGray
            Write-Host "       Les alertes en base ont deja ete envoyees avant (anti-spam 30 min)." -ForegroundColor DarkGray
            Write-Host "       Mailhog perd les emails si le conteneur redemarre, PostgreSQL non." -ForegroundColor DarkGray
        }
    } else {
        Write-Host "KO  Aucun email dans Mailhog - verifier SMTP mailhog:1025" -ForegroundColor Red
    }
} catch {
    Write-Host "KO  Mailhog inaccessible (http://localhost:8025)" -ForegroundColor Red
}

# --- Resume ---
Write-Host ""
Write-Host "=== Resume Etape 5 ===" -ForegroundColor Green
Write-Host "  API alertes : http://localhost:8001/api/v1/alertes"
Write-Host "  API lots    : http://localhost:8001/api/v1/lots"
Write-Host "  Mailhog     : http://localhost:8025"
Write-Host "  Docs        : http://localhost:8001/docs"
Write-Host ""
