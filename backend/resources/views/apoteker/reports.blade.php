@extends('layouts.apoteker')

@section('page_title', 'Laporan Keuangan & Penjualan')

@section('content')
<div class="space-y-8">
    <!-- Summary Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gradient-to-br from-emerald-600 to-teal-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-emerald-200">
            <p class="text-xs font-bold opacity-80 uppercase tracking-widest mb-2">Total Pendapatan</p>
            <h3 class="text-4xl font-black mb-6">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</h3>
            <div class="flex items-center gap-2 text-xs bg-white/20 w-fit px-3 py-1 rounded-full">
                <i data-lucide="trending-up" class="w-3 h-3"></i>
                <span>+12% dari bulan lalu</span>
            </div>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Transaksi</p>
                <h3 class="text-3xl font-black text-slate-800">{{ $totalOrders }}</h3>
            </div>
            <p class="text-[10px] text-slate-400 mt-4 italic">*Hanya menghitung pesanan yang sudah selesai</p>
        </div>

        <div class="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Rata-rata Per Transaksi</p>
                <h3 class="text-3xl font-black text-slate-800">
                    Rp {{ $totalOrders > 0 ? number_format($totalRevenue / $totalOrders, 0, ',', '.') : '0' }}
                </h3>
            </div>
            <button class="text-emerald-600 text-[10px] font-bold flex items-center gap-1 mt-4 hover:underline">
                Lihat rincian kalkulasi <i data-lucide="chevron-right" class="w-3 h-3"></i>
            </button>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Monthly Revenue List -->
        <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-8 border-b border-slate-50 flex justify-between items-center">
                <h4 class="font-bold text-slate-800 text-lg">Pendapatan Bulanan</h4>
                <select class="text-xs font-bold bg-slate-50 border-none rounded-lg px-3 py-1 outline-none">
                    <option>6 Bulan Terakhir</option>
                    <option>Tahun Ini</option>
                </select>
            </div>
            <div class="p-8 space-y-6">
                @foreach($monthlyRevenue as $item)
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                            <i data-lucide="calendar" class="w-5 h-5"></i>
                        </div>
                        <p class="font-bold text-slate-700 text-sm">{{ $item->month }}</p>
                    </div>
                    <p class="font-black text-slate-800">Rp {{ number_format($item->total, 0, ',', '.') }}</p>
                </div>
                @endforeach
            </div>
        </div>

        <!-- Top Selling Products -->
        <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-8 border-b border-slate-50">
                <h4 class="font-bold text-slate-800 text-lg">Produk Terlaris</h4>
            </div>
            <div class="p-4">
                <table class="w-full text-left">
                    <thead>
                        <tr class="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                            <th class="px-4 py-3">Nama Obat</th>
                            <th class="px-4 py-3 text-center">Terjual</th>
                            <th class="px-4 py-3 text-right">Trend</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        @foreach($topMedicines as $item)
                        <tr class="border-b border-slate-50 hover:bg-slate-50 transition-all">
                            <td class="px-4 py-5 flex items-center gap-3">
                                <div class="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                                    <i data-lucide="pill" class="w-4 h-4"></i>
                                </div>
                                <span class="font-bold text-slate-700">{{ $item->medicine->name }}</span>
                            </td>
                            <td class="px-4 py-5 text-center font-bold text-slate-600">{{ $item->total_sold }}</td>
                            <td class="px-4 py-5 text-right text-emerald-500">
                                <i data-lucide="trending-up" class="w-4 h-4 inline"></i>
                            </td>
                        </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
@endsection
