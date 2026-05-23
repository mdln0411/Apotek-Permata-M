# Jalankan PowerShell sebagai Administrator (klik kanan → Run as administrator)
# Membuka port 8000 agar HP bisa akses Laravel dari Wi-Fi yang sama

$ruleName = "Apotek Permata Laravel 8000"

$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Rule sudah ada: $ruleName"
} else {
    New-NetFirewallRule -DisplayName $ruleName `
        -Direction Inbound `
        -Protocol TCP `
        -LocalPort 8000 `
        -Action Allow `
        -Profile Private,Domain `
        -Description "Izinkan HP akses php artisan serve port 8000"
    Write-Host "Firewall rule dibuat: $ruleName"
}

Write-Host "Selesai. Tes di HP: http://192.168.1.53:8000/api/health"
