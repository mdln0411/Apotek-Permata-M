@extends('layouts.apoteker')

@section('page_title', 'Ringkasan Apotek')

@section('content')
<div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
    <!-- Stats Cards -->
    <a href="/apoteker/orders?status=menunggu" class="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-50 flex items-center gap-6 group hover:shadow-md transition-all">
        <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <i data-lucide="shopping-bag" class="text-emerald-600 w-8 h-8"></i>
        </div>
        <div>
            <p class="text-slate-500 text-sm font-medium">Pesanan Baru</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ $stats['pendingOrders'] }}</h3>
        </div>
    </a>

    <a href="/apoteker/orders?status=dilaporkan" class="bg-white p-8 rounded-[2rem] shadow-sm border border-red-50 flex items-center gap-6 group hover:shadow-md transition-all">
        <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <i data-lucide="alert-circle" class="text-red-600 w-8 h-8"></i>
        </div>
        <div>
            <p class="text-slate-500 text-sm font-medium">Laporan Masalah</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ $stats['reportedOrders'] }}</h3>
        </div>
    </a>

    <a href="/apoteker/medicines?filter=low_stock" class="bg-white p-8 rounded-[2rem] shadow-sm border border-amber-50 flex items-center gap-6 group hover:shadow-md transition-all">
        <div class="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <i data-lucide="package" class="text-amber-600 w-8 h-8"></i>
        </div>
        <div>
            <p class="text-slate-500 text-sm font-medium">Stok Menipis</p>
            <h3 class="text-3xl font-bold text-slate-800">{{ $stats['lowStock'] }}</h3>
        </div>
    </a>
</div>


<div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <!-- Recent Orders Table -->
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 class="font-bold text-slate-800">Pesanan Terbaru</h3>
            <a href="/apoteker/orders" class="text-emerald-600 text-xs font-bold hover:underline">Lihat Semua</a>
        </div>
        <div class="p-4">
            <table class="w-full text-left">
                <thead>
                    <tr class="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                        <th class="px-4 py-3">Pasien</th>
                        <th class="px-4 py-3">Total</th>
                        <th class="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    @foreach(\App\Models\Order::with('user')->latest()->take(5)->get() as $order)
                    <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td class="px-4 py-4">
                            <p class="font-bold text-slate-700">{{ $order->user->name }}</p>
                            <p class="text-[10px] text-slate-400">ID: #{{ $order->id }}</p>
                        </td>
                        <td class="px-4 py-4 font-semibold">Rp {{ number_format($order->total_price, 0, ',', '.') }}</td>

                        <td class="px-4 py-4">
                            <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase {{ $order->status == 'menunggu' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700' }}">
                                {{ $order->status }}
                            </span>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>

    <!-- Quick Actions Grid -->
    <div class="space-y-6">
        <h3 class="font-bold text-slate-800 px-2">Aksi Cepat</h3>
        <div class="grid grid-cols-2 gap-6">
            <a href="/apoteker/medicines" class="bg-emerald-600 p-6 rounded-[2rem] text-white flex flex-col items-center gap-3 hover:bg-emerald-700 transition-all group">
                <div class="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i data-lucide="plus" class="w-6 h-6"></i>
                </div>
                <span class="font-bold text-sm">Tambah Obat</span>
            </a>
            
            <a href="/apoteker/reports" class="bg-slate-800 p-6 rounded-[2rem] text-white flex flex-col items-center gap-3 hover:bg-slate-900 transition-all group">
                <div class="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <i data-lucide="bar-chart-3" class="w-6 h-6"></i>
                </div>
                <span class="font-bold text-sm">Laporan Keuangan</span>
            </a>


            <div class="col-span-2 bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-[2.5rem] border border-emerald-100 relative overflow-hidden">
                <div class="relative z-10">
                    <h4 class="text-emerald-800 font-extrabold text-xl mb-2">Butuh Bantuan?</h4>
                    <p class="text-emerald-700 text-sm opacity-80 mb-6">Hubungi administrator sistem jika <br>menemukan kendala pada data obat.</p>
                    <button class="bg-white text-emerald-700 px-6 py-2.5 rounded-full text-xs font-bold shadow-sm">Buka Support Tiket</button>
                </div>
                <i data-lucide="help-circle" class="absolute -right-8 -bottom-8 w-40 h-40 text-emerald-200/40 transform rotate-12"></i>
            </div>
        </div>
    </div>
</div>
@endsection
