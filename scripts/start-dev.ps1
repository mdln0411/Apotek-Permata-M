# Jalankan backend Laravel + Expo (dua jendela terpisah)
$projectRoot = Split-Path $PSScriptRoot -Parent
$backendScript = Join-Path $PSScriptRoot "start-backend.ps1"

Write-Host "Membuka backend Laravel (port 8000)..."
Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$backendScript`""

Start-Sleep -Seconds 2

# Port 8081 sering dipakai proses lain — pakai 8082 untuk apotek-permata
Write-Host "Membuka Expo Metro (port 8082)..."
Set-Location $projectRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot'; npx expo start -c --port 8082"

Write-Host ""
Write-Host "Selesai. Pastikan MySQL/XAMPP sudah jalan."
Write-Host "HP & laptop harus satu Wi-Fi. Scan QR dari terminal Expo."
