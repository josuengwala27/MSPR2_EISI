# Surveille les mesures IoT en temps reel (API backend Colombie)
param(
    [string]$Entrepot = "ENT-CO-BOGOTA-01",
    [int]$IntervalSeconds = 5
)

$uri = "http://localhost:8001/api/v1/mesures/dernieres?entrepot=$Entrepot"
$lastId = $null

Write-Host "Surveillance $uri (Ctrl+C pour arreter)" -ForegroundColor Cyan

while ($true) {
    try {
        $m = Invoke-RestMethod -Uri $uri -TimeoutSec 5
        if ($m.id -ne $lastId) {
            $lastId = $m.id
            $ts = Get-Date -Format "HH:mm:ss"
            Write-Host "[$ts] NOUVELLE mesure #$($m.id) | T=$($m.temperature) C | H=$($m.humidite) % | device=$($m.device_id)"
        }
    } catch {
        Write-Host "API indisponible — docker compose up ?" -ForegroundColor Yellow
    }
    Start-Sleep -Seconds $IntervalSeconds
}
