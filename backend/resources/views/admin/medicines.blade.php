@extends('layouts.admin')

@section('page_title', 'Master Data Obat')

@section('content')
<div class="space-y-8">
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-8 border-b border-slate-50 flex justify-between items-center">
            <div>
                <h3 class="font-bold text-slate-800">Inventaris Obat Global</h3>
                <p class="text-xs text-slate-500">Pantau ketersediaan stok di seluruh sistem</p>
            </div>
            <form action="/admin/medicines" method="GET" class="relative w-64">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari obat..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all">
            </form>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="text-slate-400 text-[10px] uppercase tracking-widest font-bold bg-slate-50/50">
                        <th class="px-8 py-4">Nama Obat</th>
                        <th class="px-8 py-4">Kategori</th>
                        <th class="px-8 py-4">Harga</th>
                        <th class="px-8 py-4 text-center">Stok</th>
                        <th class="px-8 py-4">Resep?</th>
                    </tr>
                </thead>
                <tbody class="text-sm divide-y divide-slate-50">
                    @foreach($medicines as $medicine)
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-8 py-5">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <i data-lucide="pill" class="w-5 h-5"></i>
                                </div>
                                <p class="font-bold text-slate-800">{{ $medicine->name }}</p>
                            </div>
                        </td>
                        <td class="px-8 py-5 text-slate-500">{{ $medicine->category }}</td>
                        <td class="px-8 py-5 font-bold text-slate-700">Rp {{ number_format($medicine->price, 0, ',', '.') }}</td>
                        <td class="px-8 py-5 text-center">
                            <span class="px-3 py-1 rounded-full text-[10px] font-bold {{ $medicine->stock < 10 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700' }}">
                                {{ $medicine->stock }}
                            </span>
                        </td>
                        <td class="px-8 py-5">
                            @if($medicine->prescription_required)
                                <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Wajib</span>
                            @else
                                <span class="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Bebas</span>
                            @endif
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>
@endsection
