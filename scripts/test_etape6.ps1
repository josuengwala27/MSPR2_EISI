# Test Etape 6 - Backend siege + mocks multi-pays

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

$api = "http://localhost:8000/api/v1"

function Write-Step($n, $msg) {
    Write-Host ""
    Write-Host "=== Etape $n : $msg ===" -ForegroundColor Cyan
}

function Invoke-DockerCompose($arguments) {
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & docker compose @arguments 2>&1 | Out-Null
    $code = $LASTEXITCODE
    $ErrorActionPreference = $prev
    return $code
}

Write-Host "FutureKawa - Test Etape 6 (Backend siege)" -ForegroundColor Green

Write-Step 0 "Demarrage Docker"
Invoke-DockerCompose @("up", "-d", "--build") | Out-Null
Start-Sleep -Seconds 12

try {
    Invoke-RestMethod "$api/health" -TimeoutSec 10 | Out-Null
} catch {
    Write-Host "KO  Backend siege indisponible" -ForegroundColor Red
    exit 1
}
Write-Host "OK  Backend siege demarre" -ForegroundColor Green

Write-Step 1 "Liste des 3 pays"
$pays = Invoke-RestMethod "$api/pays"
if ($pays.Count -eq 3) {
    Write-Host "OK  3 pays configures" -ForegroundColor Green
    $pays | ForEach-Object { Write-Host "    -> $($_.code) $($_.nom) [$($_.statut_backend)] disponible=$($_.disponible)" }
} else {
    Write-Host "KO  Attendu 3 pays, recu $($pays.Count)" -ForegroundColor Red
}

Write-Step 2 "Stocks consolides (3 pays)"
$stocks = Invoke-RestMethod "$api/stocks"
Write-Host "OK  $($stocks.total_lots) lots au total" -ForegroundColor Green
Write-Host "    CO=$($stocks.par_pays.CO) BR=$($stocks.par_pays.BR) EC=$($stocks.par_pays.EC)"

Write-Step 3 "Alertes consolidees"
$alertes = Invoke-RestMethod "$api/alertes/consolidees"
Write-Host "OK  $($alertes.total) alertes" -ForegroundColor Green
Write-Host "    CO=$($alertes.par_pays.CO) BR=$($alertes.par_pays.BR) EC=$($alertes.par_pays.EC)"

Write-Step 4 "Proxy Colombie (live)"
$coLots = Invoke-RestMethod "$api/pays/CO/lots"
Write-Host "OK  $($coLots.Count) lots Colombie (donnees live)" -ForegroundColor Green

Write-Step 5 "Proxy Bresil (mock)"
$brLots = Invoke-RestMethod "$api/pays/BR/lots"
$brMesure = Invoke-RestMethod "http://localhost:8002/api/v1/mesures/dernieres?entrepot=ENT-BR-SAO-PAULO-01"
Write-Host "OK  $($brLots.Count) lots BR | T=$($brMesure.temperature) H=$($brMesure.humidite)" -ForegroundColor Green

Write-Step 6 "Proxy Equateur (mock)"
$ecLots = Invoke-RestMethod "$api/pays/EC/lots"
$ecMesure = Invoke-RestMethod "http://localhost:8003/api/v1/mesures/dernieres?entrepot=ENT-EC-QUITO-01"
Write-Host "OK  $($ecLots.Count) lots EC | T=$($ecMesure.temperature) H=$($ecMesure.humidite)" -ForegroundColor Green

Write-Step 7 "Gestion panne backend (stop mock Bresil)"
docker stop mspr2eisi-mock-bresil-1 2>&1 | Out-Null
Start-Sleep -Seconds 2
try {
    Invoke-RestMethod "$api/pays/BR/lots" -TimeoutSec 10 | Out-Null
    Write-Host "KO  Devrait retourner 502" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 502) {
        Write-Host "OK  Erreur 502 propre quand Bresil est down" -ForegroundColor Green
    } else {
        Write-Host "ATTENTION  Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}
docker start mspr2eisi-mock-bresil-1 2>&1 | Out-Null
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "=== Resume Etape 6 ===" -ForegroundColor Green
Write-Host "  Siege docs  : http://localhost:8000/docs"
Write-Host "  Pays        : http://localhost:8000/api/v1/pays"
Write-Host "  Stocks      : http://localhost:8000/api/v1/stocks"
Write-Host "  Alertes     : http://localhost:8000/api/v1/alertes/consolidees"
Write-Host ""
