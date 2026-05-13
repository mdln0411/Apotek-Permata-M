# Apotek Permata - Admin Frontend

Aplikasi manajemen apotek berbasis React Native + Expo Router (TypeScript).

## Struktur Project

```
apotek-admin/
├── app/
│   ├── _layout.tsx              # Root layout
│   └── (admin)/
│       ├── _layout.tsx          # Admin stack navigator
│       ├── index.tsx            # Dashboard Admin
│       ├── transaksi.tsx        # Manajemen Transaksi
│       ├── obat.tsx             # Manajemen Obat
│       ├── pengguna.tsx         # Manajemen Pengguna (placeholder)
│       └── laporan.tsx          # Laporan (placeholder)
├── components/
│   └── Header.tsx               # Komponen header global
├── constants/
│   └── theme.ts                 # Warna, spacing, radius, font sizes
├── app.json
├── babel.config.js
├── package.json
└── tsconfig.json
```

## Cara Menjalankan

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan app:**
   ```bash
   npm start
   ```

3. Scan QR code dengan Expo Go (Android/iOS) atau tekan `a` untuk Android emulator / `i` untuk iOS simulator.

## Halaman yang Sudah Dibuat

| Halaman | Status | Keterangan |
|---|---|---|
| Dashboard Admin | ✅ Selesai | Stats, chart mingguan, produk terlaris, quick menu |
| Manajemen Transaksi | ✅ Selesai | List transaksi, filter status, badge status |
| Manajemen Obat | ✅ Selesai | List obat, search, tambah/edit/hapus |
| Pengguna | 🔲 Placeholder | Menunggu desain |
| Laporan | 🔲 Placeholder | Menunggu desain |

## Integrasi Backend (Laravel)

Saat backend siap, ganti data statis di masing-masing screen dengan API call ke Laravel:

```typescript
// Contoh fetch dari Laravel
const response = await fetch('http://your-api.com/api/admin/medicines', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});
const data = await response.json();
```

## Dependencies Utama

- `expo` ~52.0.0
- `expo-router` ~4.0.0
- `@expo/vector-icons` (Ionicons)
- `react-native-safe-area-context`
- `react-native-screens`
