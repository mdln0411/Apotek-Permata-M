@extends('layouts.apoteker')

@section('page_title', 'Validasi Resep Digital')

@section('content')
<div class="grid grid-cols-1 xl:grid-cols-3 gap-8">
    <!-- Prescription List -->
    <div class="xl:col-span-2 space-y-6">
        <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div class="p-8 border-b border-slate-50">
                <h3 class="font-bold text-slate-800 text-xl">Antrean Resep Masuk</h3>
            </div>
            
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                @foreach($prescriptions as $p)
                <div class="border border-slate-100 rounded-3xl p-5 hover:border-emerald-200 transition-all group {{ $p->status == 'pending' ? 'bg-amber-50/30' : '' }}">
                    <div class="flex gap-4">
                        <div class="w-24 h-32 bg-slate-100 rounded-2xl overflow-hidden relative shadow-inner">
                            <img src="{{ str_starts_with($p->image_url, 'http') ? $p->image_url : asset('storage/'.$p->image_url) }}" class="w-full h-full object-cover">
                            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onclick="window.open('{{ str_starts_with($p->image_url, 'http') ? $p->image_url : asset('storage/'.$p->image_url) }}', '_blank')" class="bg-white p-2 rounded-full shadow-lg">
                                    <i data-lucide="maximize" class="w-4 h-4 text-slate-800"></i>
                                </button>
                            </div>
                        </div>
                        <div class="flex-1">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <p class="font-bold text-slate-800">{{ $p->user->name }}</p>
                                    <p class="text-[10px] text-slate-400">{{ $p->created_at->diffForHumans() }}</p>
                                </div>
                                <span class="px-2 py-0.5 rounded-full text-[8px] font-black uppercase {{ $p->status == 'pending' ? 'bg-amber-100 text-amber-700' : ($p->status == 'valid' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700') }}">
                                    {{ $p->status }}
                                </span>
                            </div>
                            
                            @if($p->status == 'pending')
                            <div class="mt-4 flex gap-2">
                                <form action="/apoteker/prescriptions/{{ $p->id }}/status" method="POST" class="flex-1">
                                    @csrf
                                    <input type="hidden" name="status" value="valid">
                                    <button class="w-full bg-emerald-600 text-white py-2 rounded-xl text-[10px] font-bold hover:bg-emerald-700 transition-all">VALIDASI</button>
                                </form>
                                <form action="/apoteker/prescriptions/{{ $p->id }}/status" method="POST" class="flex-1">
                                    @csrf
                                    <input type="hidden" name="status" value="rejected">
                                    <button class="w-full bg-white border border-red-200 text-red-600 py-2 rounded-xl text-[10px] font-bold hover:bg-red-50 transition-all">TOLAK</button>
                                </form>
                            </div>
                            @else
                                <p class="text-[10px] text-slate-500 italic mt-2">Catatan: {{ $p->notes ?? 'Tidak ada catatan' }}</p>
                            @endif
                        </div>
                    </div>
                </div>
                @endforeach
            </div>
        </div>
    </div>

    <!-- Side Help/Info -->
    <div class="space-y-6">
        <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
            <h4 class="text-xl font-bold mb-4">Panduan Validasi</h4>
            <ul class="space-y-4 text-xs opacity-80">
                <li class="flex gap-3">
                    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                    Pastikan nama dokter dan SIP terlihat jelas di resep.
                </li>
                <li class="flex gap-3">
                    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                    Periksa tanggal resep (maksimal 30 hari terakhir).
                </li>
                <li class="flex gap-3">
                    <i data-lucide="check-circle" class="w-4 h-4 text-emerald-400 shrink-0"></i>
                    Verifikasi dosis dan jenis obat sesuai stok.
                </li>
            </ul>
            <i data-lucide="shield-check" class="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 transform rotate-12"></i>
        </div>

        <div class="bg-emerald-50 rounded-[2.5rem] p-8 border border-emerald-100">
            <h4 class="font-bold text-emerald-800 mb-2">Butuh Chat Pasien?</h4>
            <p class="text-[10px] text-emerald-700 mb-4 leading-relaxed">Jika resep kurang jelas, kamu bisa menghubungi pasien langsung melalui fitur konsultasi.</p>
            <a href="/apoteker/chat" class="inline-block bg-emerald-600 text-white px-6 py-2 rounded-full text-[10px] font-bold shadow-lg shadow-emerald-200">Mulai Chat</a>
        </div>
    </div>
</div>
@endsection
