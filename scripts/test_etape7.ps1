# Test Etape 7 - Frontend React FutureKawa

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "FutureKawa - Test Etape 7 (Frontend)" -ForegroundColor Green

function Invoke-DockerCompose($arguments) {
    $prev = $ErrorActionPreference
    $ErrorActionPreference = "Continue"
    & docker compose @arguments 2>&1 | Out-Null
    $code = $LASTEXITCODE
    $ErrorActionPreference = $prev
    return $code
}

Write-Host ""
Write-Host "=== Demarrage stack (backend + frontend) ===" -ForegroundColor Cyan
Invoke-DockerCompose @("up", "-d", "--build") | Out-Null
Start-Sleep -Seconds 20

$checks = @(
    @{ Name = "Backend siege"; Url = "http://localhost:8000/api/v1/health" },
    @{ Name = "API stocks"; Url = "http://localhost:8000/api/v1/stocks" },
    @{ Name = "Frontend"; Url = "http://localhost:3000" }
)

foreach ($c in $checks) {
    try {
        $r = Invoke-WebRequest -Uri $c.Url -TimeoutSec 15 -UseBasicParsing
        if ($r.StatusCode -eq 200) {
            Write-Host "OK  $($c.Name) -> $($c.Url)" -ForegroundColor Green
        }
    } catch {
        Write-Host "KO  $($c.Name) -> $($c.Url)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Parcours API (donnees affichees par le front) ===" -ForegroundColor Cyan
$stocks = Invoke-RestMethod "http://localhost:8000/api/v1/stocks"
$alertes = Invoke-RestMethod "http://localhost:8000/api/v1/alertes/consolidees"
Write-Host "OK  $($stocks.total_lots) lots | $($alertes.total) alertes" -ForegroundColor Green

Write-Host ""
Write-Host "=== Ouvre dans le navigateur ===" -ForegroundColor Green
Write-Host "  http://localhost:3000          Tableau de bord"
Write-Host "  http://localhost:3000/pays     Selection pays"
Write-Host "  http://localhost:3000/alertes  Centre alertes"
Write-Host ""
Write-Host "Test responsive : F12 -> mode mobile (iPhone / iPad)" -ForegroundColor Gray
Write-Host ""
