@extends('layouts.apoteker')

@section('page_title', 'Validasi Pesanan')

@section('content')
<div class="space-y-8">
    <!-- Filters & Stats Summary -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p class="text-xs font-bold text-slate-400 uppercase mb-1">Total Pesanan</p>
            <p class="text-2xl font-black text-slate-800">{{ $orders->count() }}</p>
        </div>
        <div class="bg-amber-50 p-6 rounded-3xl border border-amber-100 shadow-sm">
            <p class="text-xs font-bold text-amber-600 uppercase mb-1">Menunggu</p>
            <p class="text-2xl font-black text-amber-700">{{ $orders->where('status', 'menunggu')->count() }}</p>
        </div>
        <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100 shadow-sm">
            <p class="text-xs font-bold text-blue-600 uppercase mb-1">Diproses</p>
            <p class="text-2xl font-black text-blue-700">{{ $orders->where('status', 'diproses')->count() }}</p>
        </div>
        <div class="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
            <p class="text-xs font-bold text-emerald-600 uppercase mb-1">Selesai</p>
            <p class="text-2xl font-black text-emerald-700">{{ $orders->where('status', 'selesai')->count() }}</p>
        </div>
    </div>

    <!-- Orders List -->
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 class="font-bold text-slate-800 text-xl">Daftar Antrean Pesanan</h3>
            <div class="flex gap-3">
                <form action="/apoteker/orders" method="GET" class="flex gap-2">
                    <select name="status" onchange="this.form.submit()" class="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold border border-slate-100 outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="">Semua Status</option>
                        <option value="menunggu" {{ request('status') == 'menunggu' ? 'selected' : '' }}>Menunggu</option>
                        <option value="diproses" {{ request('status') == 'diproses' ? 'selected' : '' }}>Diproses</option>
                        <option value="dikirim" {{ request('status') == 'dikirim' ? 'selected' : '' }}>Dikirim</option>
                        <option value="selesai" {{ request('status') == 'selesai' ? 'selected' : '' }}>Selesai</option>
                        <option value="dilaporkan" {{ request('status') == 'dilaporkan' ? 'selected' : '' }}>Masalah / Dilaporkan</option>
                        <option value="batal_pasien" {{ request('status') == 'batal_pasien' ? 'selected' : '' }}>Dibatalkan Pasien</option>
                        <option value="dibatalkan" {{ request('status') == 'dibatalkan' ? 'selected' : '' }}>Dibatalkan</option>
                    </select>
                </form>
                <a href="/apoteker/orders/export" class="px-6 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center gap-2">
                    <i data-lucide="download" class="w-3 h-3"></i>
                    Download CSV
                </a>
            </div>
        </div>


        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="text-slate-400 text-[10px] uppercase tracking-widest font-bold bg-slate-50/50">
                        <th class="px-8 py-5">Order ID & Tanggal</th>
                        <th class="px-8 py-5">Pasien</th>
                        <th class="px-8 py-5">Item Obat</th>
                        <th class="px-8 py-5">Total Pembayaran</th>
                        <th class="px-8 py-5">Status</th>
                        <th class="px-8 py-5 text-right">Aksi</th>
                    </tr>
                </thead>
                <tbody class="text-sm divide-y divide-slate-50">
                    @foreach($orders as $order)
                    <tr class="hover:bg-slate-50/50 transition-colors">
                        <td class="px-8 py-6">
                            <p class="font-black text-slate-800">#{{ $order->order_number }}</p>
                            <p class="text-[10px] text-slate-400">{{ $order->created_at->format('d M Y, H:i') }}</p>
                        </td>
                        <td class="px-8 py-6">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-[10px]">
                                    {{ substr($order->user->name, 0, 1) }}
                                </div>
                                <p class="font-bold text-slate-700">{{ $order->user->name }}</p>
                            </div>
                        </td>
                        <td class="px-8 py-6">
                            <div class="space-y-1">
                                @foreach($order->items->take(2) as $item)
                                    <p class="text-xs text-slate-600">• {{ $item->medicine->name }} ({{ $item->quantity }})</p>
                                @endforeach
                                @if($order->items->count() > 2)
                                    <p class="text-[10px] text-emerald-600 font-bold">+{{ $order->items->count() - 2 }} item lainnya</p>
                                @endif
                            </div>
                        </td>
                        <td class="px-8 py-6">
                            <p class="font-black text-slate-800">Rp {{ number_format($order->total_price, 0, ',', '.') }}</p>
                        </td>
                        <td class="px-8 py-6">
                            @php
                                $isBatalUser = $order->status === 'dibatalkan' && (str_contains(strtolower($order->notes), 'pengguna') || str_contains(strtolower($order->notes), 'pembeli') || (!str_contains(strtolower($order->notes), 'apoteker') && !str_contains(strtolower($order->notes), 'admin')));
                                $statusText = $isBatalUser ? 'Batal Pasien' : $order->status;
                                $statusClasses = [
                                    'menunggu' => 'bg-amber-100 text-amber-700 border-amber-200',
                                    'diproses' => 'bg-blue-100 text-blue-700 border-blue-200',
                                    'selesai' => 'bg-emerald-100 text-emerald-700 border-emerald-200',
                                    'dibatalkan' => 'bg-red-100 text-red-700 border-red-200',
                                    'dilaporkan' => 'bg-purple-100 text-purple-700 border-purple-200',
                                ];
                                $cls = $statusClasses[$order->status] ?? 'bg-slate-100 text-slate-700 border-slate-200';
                                if ($isBatalUser) {
                                    $cls = 'bg-slate-100 text-slate-600 border-slate-300';
                                }
                            @endphp
                            <span class="px-3 py-1 rounded-full text-[8px] font-bold uppercase border {{ $cls }}">
                                {{ $statusText }}
                            </span>
                            @if($order->notes)
                                <p class="text-[9px] text-slate-500 mt-1.5 max-w-[160px] truncate italic" title="{{ $order->notes }}">{{ $order->notes }}</p>
                            @endif
                        </td>
                        <td class="px-8 py-6 text-right">
                            <div class="flex justify-end gap-2">
                                <form action="/apoteker/orders/{{ $order->id }}/status" method="POST">
                                    @csrf
                                    <select name="status" onchange="this.form.submit()" class="bg-slate-50 border border-slate-200 text-[10px] font-bold rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-emerald-500">
                                        <option value="" disabled selected>Update Status</option>
                                        <option value="diproses">Proses</option>
                                        <option value="dikirim">Kirim</option>
                                        <option value="selesai">Selesai</option>
                                        <option value="dibatalkan">Batalkan</option>
                                    </select>
                                </form>
                                <button onclick="viewDetail({{ $order->id }})" class="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all">
                                    <i data-lucide="eye" class="w-4 h-4"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Detail Modal -->
<div id="modal-detail" class="fixed inset-0 z-[60] hidden overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" onclick="toggleModal('modal-detail')"></div>
        <div class="inline-block w-full max-w-2xl p-10 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-[3rem]">
            <div class="flex justify-between items-center mb-8">
                <h3 class="text-2xl font-black text-slate-800">Detail Pesanan <span id="det-number" class="text-emerald-600"></span></h3>
                <button onclick="toggleModal('modal-detail')" class="text-slate-400 hover:text-slate-600"><i data-lucide="x" class="w-6 h-6"></i></button>
            </div>
            
            <div class="grid grid-cols-2 gap-8 mb-8">
                <div>
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Informasi Pasien</p>
                    <p id="det-user-name" class="font-bold text-slate-800 text-lg"></p>
                    <p id="det-user-phone" class="text-sm text-slate-500"></p>
                    <p id="det-address" class="text-sm text-slate-500 mt-2 leading-relaxed"></p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Status Pembayaran</p>
                    <span class="bg-emerald-100 text-emerald-700 px-4 py-1 rounded-full text-xs font-bold uppercase">Lunas (Transfer)</span>
                    <p id="det-date" class="text-[10px] text-slate-400 mt-4"></p>
                </div>
            </div>

            <div class="border-t border-slate-100 pt-8">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Rincian Obat</p>
                <div id="det-items" class="space-y-4">
                    <!-- Items will be injected here -->
                </div>
            </div>

            <div id="det-notes-container" class="border-t border-slate-100 mt-8 pt-8 hidden">
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Catatan / Alasan Masalah</p>
                <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p id="det-notes" class="text-slate-600 text-sm italic"></p>
                </div>
            </div>

            <div class="border-t border-slate-100 mt-8 pt-6 flex justify-between items-center">
                <p class="font-bold text-slate-500">Total Pembayaran</p>
                <p id="det-total" class="text-2xl font-black text-emerald-600"></p>
            </div>
        </div>
    </div>
</div>

<script>
    function toggleModal(id) {
        document.getElementById(id).classList.toggle('hidden');
    }

    async function viewDetail(id) {
        const response = await fetch(`/apoteker/orders/${id}`);
        const order = await response.json();
        
        document.getElementById('det-number').innerText = `#${order.order_number}`;
        document.getElementById('det-user-name').innerText = order.user.name;
        document.getElementById('det-user-phone').innerText = order.user.phone || '-';
        document.getElementById('det-address').innerText = order.shipping_address;
        document.getElementById('det-date').innerText = `Dipesan pada: ${new Date(order.created_at).toLocaleString('id-ID')}`;
        document.getElementById('det-total').innerText = `Rp ${new Intl.NumberFormat('id-ID').format(order.total_price)}`;
        
        if (order.notes) {
            document.getElementById('det-notes').innerText = order.notes;
            document.getElementById('det-notes-container').classList.remove('hidden');
        } else {
            document.getElementById('det-notes-container').classList.add('hidden');
        }
        
        const itemsContainer = document.getElementById('det-items');
        itemsContainer.innerHTML = '';
        order.items.forEach(item => {
            itemsContainer.innerHTML += `
                <div class="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100">
                            <i data-lucide="pill" class="w-5 h-5 text-emerald-600"></i>
                        </div>
                        <div>
                            <p class="font-bold text-slate-800 text-sm">${item.medicine.name}</p>
                            <p class="text-[10px] text-slate-400">${item.quantity} x Rp ${new Intl.NumberFormat('id-ID').format(item.price)}</p>
                        </div>
                    </div>
                    <p class="font-black text-slate-800 text-sm">Rp ${new Intl.NumberFormat('id-ID').format(item.quantity * item.price)}</p>
                </div>
            `;
        });
        
        toggleModal('modal-detail');
        lucide.createIcons();
    }
</script>
@endsection

