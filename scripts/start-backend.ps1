# Jalankan MySQL (XAMPP) + Laravel — dari folder project
$projectRoot = Split-Path $PSScriptRoot -Parent
$backend = Join-Path $projectRoot "backend"

if (Test-Path "D:\xampp\mysql_start.bat") {
    Start-Process "D:\xampp\mysql_start.bat" -WindowStyle Hidden
    Write-Host "MySQL XAMPP starting..."
    Start-Sleep -Seconds 3
}

Set-Location $backend
Write-Host "Laravel: http://0.0.0.0:8000 (akses HP: http://192.168.1.53:8000)"
php artisan serve --host=0.0.0.0 --port=8000
