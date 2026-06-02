# Perbaiki database MySQL yang rusak (error 1932 / tablespace orphan).
# Jalankan dari root project: .\scripts\repair-database.ps1

$ErrorActionPreference = "Stop"
$projectRoot = Split-Path $PSScriptRoot -Parent
$backend = Join-Path $projectRoot "backend"
$mysqlBin = "D:\xampp\mysql\bin"
$dataDir = "D:\xampp\mysql\data\apotek_permata"

if (-not (Test-Path "$mysqlBin\mysql.exe")) {
    Write-Host "MySQL XAMPP tidak ditemukan di $mysqlBin. Sesuaikan path di script ini."
    exit 1
}

Write-Host "Menghentikan MySQL..."
& "$mysqlBin\mysqladmin.exe" -u root shutdown 2>$null
Start-Sleep -Seconds 3

if (Test-Path $dataDir) {
    Write-Host "Menghapus folder data rusak: $dataDir"
    Remove-Item $dataDir -Recurse -Force
}

Write-Host "Menjalankan MySQL..."
if (Test-Path "D:\xampp\mysql_start.bat") {
    Start-Process "D:\xampp\mysql_start.bat" -WindowStyle Hidden
    Start-Sleep -Seconds 5
}

Write-Host "Membuat database apotek_permata..."
& "$mysqlBin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS apotek_permata CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

Set-Location $backend
Write-Host "Menjalankan migrasi..."
php artisan migrate --force
Write-Host "Menjalankan seeder..."
php artisan db:seed --force

Write-Host ""
Write-Host "Selesai. Database siap digunakan."
Write-Host "Akun demo: admin@apotek.com / password123"
