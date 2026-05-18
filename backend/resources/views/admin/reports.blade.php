@extends('layouts.admin')

@section('page_title', 'Laporan Bisnis Global')

@section('content')
<div class="space-y-10">
    <!-- Executive Summary -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-gradient-to-br from-blue-700 to-indigo-800 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-200">
            <p class="text-xs font-bold opacity-70 uppercase tracking-widest mb-2">Total Omzet Bersih</p>
            <h3 class="text-5xl font-black mb-8">Rp {{ number_format($totalRevenue, 0, ',', '.') }}</h3>
            <div class="flex items-center gap-4 text-sm font-bold bg-white/10 w-fit px-4 py-2 rounded-2xl">
                <i data-lucide="trending-up" class="w-4 h-4"></i>
                <span>Performa Sangat Baik</span>
            </div>
        </div>

        <div class="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Volume Penjualan</p>
                <h3 class="text-4xl font-black text-slate-800">{{ $totalOrders }} <span class="text-sm font-bold text-slate-400">Order</span></h3>
            </div>
            <p class="text-xs text-slate-400 mt-6 leading-relaxed">Rata-rata transaksi harian meningkat sebesar 8% dari periode sebelumnya.</p>
        </div>

        <div class="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
                <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Profit Per Transaksi</p>
                <h3 class="text-4xl font-black text-slate-800">
                    Rp {{ $totalOrders > 0 ? number_format($totalRevenue / $totalOrders, 0, ',', '.') : '0' }}
                </h3>
            </div>
            <div class="flex -space-x-3 mt-6">
                <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-200"></div>
                <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-300"></div>
                <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-400"></div>
                <div class="w-10 h-10 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">+12</div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <!-- Revenue Trends -->
        <div class="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-10 border-b border-slate-50">
                <h4 class="font-black text-slate-800 text-xl">Tren Pertumbuhan Bulanan</h4>
                <p class="text-xs text-slate-400 mt-1">Data akumulasi pendapatan 12 bulan terakhir</p>
            </div>
            <div class="p-10 space-y-8">
                @foreach($monthlyRevenue as $item)
                <div class="space-y-3">
                    <div class="flex justify-between items-end">
                        <p class="font-bold text-slate-700 text-sm">{{ $item->month }}</p>
                        <p class="font-black text-blue-700 text-sm">Rp {{ number_format($item->total, 0, ',', '.') }}</p>
                    </div>
                    <div class="w-full bg-slate-50 h-3 rounded-full overflow-hidden">
                        @php $percent = $totalRevenue > 0 ? ($item->total / $totalRevenue) * 500 : 0; @endphp
                        <div class="bg-blue-600 h-full rounded-full transition-all duration-1000" style="width: {{ min(100, $percent) }}%"></div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>

        <!-- Inventory Distribution -->
        <div class="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-10 border-b border-slate-50">
                <h4 class="font-black text-slate-800 text-xl">Distribusi Katalog Obat</h4>
                <p class="text-xs text-slate-400 mt-1">Pembagian stok berdasarkan kategori utama</p>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-2 gap-6">
                    @foreach($topCategories as $cat)
                    <div class="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                            <i data-lucide="tag" class="w-5 h-5 text-blue-600"></i>
                        </div>
                        <p class="font-black text-slate-800 text-lg">{{ $cat->count }}</p>
                        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{{ $cat->category }}</p>
                    </div>
                    @endforeach
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
