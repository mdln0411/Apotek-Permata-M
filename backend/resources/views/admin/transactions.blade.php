@extends('layouts.admin')

@section('page_title', 'Riwayat Transaksi Global')

@section('content')
<div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-8 border-b border-slate-50 flex justify-between items-center">
        <div>
            <h3 class="font-bold text-slate-800">Semua Aktivitas Transaksi</h3>
            <p class="text-xs text-slate-500">Log lengkap transaksi dari seluruh pasien</p>
        </div>
        <form action="/admin/transactions" method="GET" class="flex gap-3">
            <select name="status" onchange="this.form.submit()" class="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-100 outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Semua Status</option>
                <option value="menunggu" {{ request('status') == 'menunggu' ? 'selected' : '' }}>Menunggu</option>
                <option value="diproses" {{ request('status') == 'diproses' ? 'selected' : '' }}>Diproses</option>
                <option value="selesai" {{ request('status') == 'selesai' ? 'selected' : '' }}>Selesai</option>
                <option value="dibatalkan" {{ request('status') == 'dibatalkan' ? 'selected' : '' }}>Dibatalkan</option>
            </select>
        </form>
    </div>
    
    <div class="overflow-x-auto">
        <table class="w-full text-left">
            <thead>
                <tr class="text-slate-400 text-[10px] uppercase tracking-widest font-bold bg-slate-50/50">
                    <th class="px-8 py-5">Order ID</th>
                    <th class="px-8 py-5">Pasien</th>
                    <th class="px-8 py-5">Total Pembayaran</th>
                    <th class="px-8 py-5">Status</th>
                    <th class="px-8 py-5 text-right">Tanggal</th>
                </tr>
            </thead>
            <tbody class="text-sm divide-y divide-slate-50">
                @foreach($orders as $order)
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-8 py-6 font-black text-slate-800">#{{ $order->order_number }}</td>
                    <td class="px-8 py-6">
                        <div class="flex items-center gap-3">
                            <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-[10px]">
                                {{ substr($order->user->name, 0, 1) }}
                            </div>
                            <p class="font-bold text-slate-700">{{ $order->user->name }}</p>
                        </div>
                    </td>
                    <td class="px-8 py-6 font-black text-blue-700">Rp {{ number_format($order->total_price, 0, ',', '.') }}</td>
                    <td class="px-8 py-6">
                        @php
                            $statusClasses = [
                                'menunggu' => 'bg-amber-100 text-amber-700 border-amber-200',
                                'diproses' => 'bg-indigo-100 text-indigo-700 border-indigo-200',
                                'selesai' => 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                'dibatalkan' => 'bg-red-100 text-red-700 border-red-200',
                            ];
                            $cls = $statusClasses[$order->status] ?? 'bg-slate-100 text-slate-700 border-slate-200';
                        @endphp
                        <span class="px-3 py-1 rounded-full text-[8px] font-bold uppercase border {{ $cls }}">
                            {{ $order->status }}
                        </span>
                    </td>
                    <td class="px-8 py-6 text-right text-slate-400 text-xs">
                        {{ $order->created_at->format('d M Y, H:i') }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>
@endsection
