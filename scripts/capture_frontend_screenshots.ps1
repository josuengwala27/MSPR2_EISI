# Genere 3 captures pour la soutenance FutureKawa
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root
$outDir = Join-Path $root "docs\screenshots"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

$base = "http://localhost:3000"
$shots = @(
    @{ File = "dashboard-desktop.png"; Url = $base; Size = "1280,800" },
    @{ File = "dashboard-mobile.png"; Url = $base; Size = "390,844" },
    @{ File = "capteurs-desktop.png"; Url = "$base/iot"; Size = "1280,800" }
)

Write-Host "FutureKawa - Capture screenshots" -ForegroundColor Cyan

try {
    Invoke-WebRequest -Uri $base -TimeoutSec 5 -UseBasicParsing | Out-Null
} catch {
    Write-Host "Frontend indisponible sur $base - lancez docker compose up" -ForegroundColor Red
    exit 1
}

foreach ($s in $shots) {
    $path = Join-Path $outDir $s.File
    Write-Host "Capture $($s.File)..."
    npx --yes playwright@1.49.1 screenshot --viewport-size=$($s.Size) $s.Url $path 2>&1 | Out-Null
    if (Test-Path $path) {
        Write-Host "  OK  $path" -ForegroundColor Green
    } else {
        Write-Host "  KO  $($s.File)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Captures dans docs/screenshots/" -ForegroundColor Green
