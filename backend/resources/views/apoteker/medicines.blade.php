@extends('layouts.apoteker')

@section('page_title', 'Manajemen Stok Obat')

@section('content')
@if(session('success'))
    <div class="mb-6 p-4 bg-emerald-100 text-emerald-700 rounded-2xl font-bold flex items-center gap-3">
        <i data-lucide="check-circle" class="w-5 h-5"></i>
        {{ session('success') }}
    </div>
@endif

@if($errors->any())
    <div class="mb-6 p-4 bg-red-100 text-red-700 rounded-2xl font-bold space-y-1">
        <div class="flex items-center gap-3 mb-1">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
            <span>Ups! Ada kesalahan pengisian:</span>
        </div>
        <ul class="list-disc list-inside text-xs font-medium ml-8">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">

    <div class="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h3 class="font-bold text-slate-800">Daftar Obat-obatan</h3>
            <p class="text-xs text-slate-500">Kelola stok dan harga obat di apotek</p>
        </div>
        <div class="flex gap-3 w-full md:w-auto">
            <form action="/apoteker/medicines" method="GET" class="relative flex-1 md:w-64">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                <input type="text" name="q" value="{{ request('q') }}" placeholder="Cari obat..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all">
            </form>
            <button onclick="toggleModal('modal-add')" class="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all whitespace-nowrap">
                <i data-lucide="plus" class="w-4 h-4"></i>
                Obat Baru
            </button>
        </div>

    </div>
    
    <div class="overflow-x-auto">
        <table class="w-full text-left">
            <thead>
                <tr class="text-slate-400 text-[10px] uppercase tracking-widest font-bold bg-slate-50/50">
                    <th class="px-8 py-4">Informasi Obat</th>
                    <th class="px-8 py-4">Kategori</th>
                    <th class="px-8 py-4">Harga</th>
                    <th class="px-8 py-4">Stok</th>
                    <th class="px-8 py-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody class="text-sm divide-y divide-slate-50">
                @foreach($medicines as $medicine)
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-8 py-5">
                        <div class="flex items-center gap-4">
                            <div class="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden flex items-center justify-center">
                                @if($medicine->image_url)
                                    <img src="{{ $medicine->image_url }}" class="w-full h-full object-cover">
                                @else
                                    <i data-lucide="pill" class="text-slate-300 w-6 h-6"></i>
                                @endif
                            </div>
                            <div>
                                <p class="font-bold text-slate-800">{{ $medicine->name }}</p>
                                <p class="text-[10px] text-slate-400 uppercase tracking-tighter">{{ $medicine->unit }}</p>
                            </div>
                        </div>
                    </td>
                    <td class="px-8 py-5">
                        <span class="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold uppercase">{{ $medicine->category }}</span>
                    </td>
                    <td class="px-8 py-5 font-bold text-slate-700">Rp {{ number_format($medicine->price, 0, ',', '.') }}</td>
                    <td class="px-8 py-5">
                        <div class="flex flex-col gap-1">
                            <span class="font-bold {{ $medicine->stock < 10 ? 'text-red-600' : 'text-emerald-600' }}">{{ $medicine->stock }} Unit</span>
                            <div class="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div class="h-full {{ $medicine->stock < 10 ? 'bg-red-500' : 'bg-emerald-500' }}" style="width: {{ min(($medicine->stock/50)*100, 100) }}%"></div>
                            </div>
                        </div>
                    </td>
                    <td class="px-8 py-5 text-right">
                        <div class="flex justify-end gap-2">
                            <button onclick='editMedicine(@json($medicine))' class="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" title="Edit">
                                <i data-lucide="edit-3" class="w-4 h-4"></i>
                            </button>
                            <form action="/apoteker/medicines/{{ $medicine->id }}" method="POST" onsubmit="return confirm('Apakah anda yakin ingin menghapus obat ini? Semua data terkait akan hilang.')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                                </button>
                            </form>
                        </div>
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
</div>

<!-- Modal Add -->
<div id="modal-add" class="fixed inset-0 z-[60] hidden overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 py-8 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" onclick="toggleModal('modal-add')"></div>
        <div class="inline-block w-full max-w-4xl p-10 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-[3rem]">
            <h3 class="text-2xl font-black text-slate-800 mb-8">Tambah Obat Baru</h3>
            <form action="/apoteker/medicines" method="POST" class="space-y-6">
                @csrf
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Basic Info -->
                    <div class="space-y-4">
                        <h4 class="text-xs font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Informasi Dasar</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Obat</label>
                                <input type="text" name="name" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kategori (ex: Lambung)</label>
                                <input type="text" name="category" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Satuan (ex: Strip)</label>
                                <input type="text" name="unit" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Harga (Rp)</label>
                                <input type="number" name="price" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Stok</label>
                                <input type="number" name="stock" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                        </div>
                        <div class="col-span-2 mt-4">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Link Gambar Obat (URL)</label>
                            <input type="url" name="image_url" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500" placeholder="https://example.com/obat.jpg">
                        </div>
                        <div class="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <input type="checkbox" name="prescription_required" value="1" class="w-5 h-5 rounded text-emerald-600 border-amber-200">
                            <label class="text-xs font-bold text-amber-800">Perlu Resep Dokter?</label>
                        </div>
                    </div>

                    <!-- Medical Info -->
                    <div class="space-y-4">
                        <h4 class="text-xs font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Informasi Medis</h4>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Indikasi / Fungsi</label>
                            <textarea name="indication" rows="2" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Aturan Pakai</label>
                            <textarea name="usage_rules" rows="2" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Komposisi</label>
                            <textarea name="composition" rows="2" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Efek Samping</label>
                            <textarea name="side_effects" rows="2" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="button" onclick="toggleModal('modal-add')" class="flex-1 px-6 py-4 font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">Batal</button>
                    <button type="submit" class="flex-1 px-6 py-4 font-bold text-white bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all">Simpan Obat</button>
                </div>
            </form>
        </div>
    </div>
</div>

<!-- Modal Edit -->
<div id="modal-edit" class="fixed inset-0 z-[60] hidden overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 py-8 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" onclick="toggleModal('modal-edit')"></div>
        <div class="inline-block w-full max-w-4xl p-10 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-[3rem]">
            <h3 class="text-2xl font-black text-slate-800 mb-8">Edit Data Obat</h3>
            <form id="form-edit" method="POST" class="space-y-6">
                @csrf
                @method('PUT')
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <!-- Basic Info -->
                    <div class="space-y-4">
                        <h4 class="text-xs font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Informasi Dasar</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="col-span-2">
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Nama Obat</label>
                                <input type="text" name="name" id="edit-name" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Kategori</label>
                                <input type="text" name="category" id="edit-category" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Satuan</label>
                                <input type="text" name="unit" id="edit-unit" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Harga (Rp)</label>
                                <input type="number" name="price" id="edit-price" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Stok</label>
                                <input type="number" name="stock" id="edit-stock" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                            </div>
                        </div>
                        <div class="col-span-2 mt-4">
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Link Gambar Obat (URL)</label>
                            <input type="url" name="image_url" id="edit-image_url" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500">
                        </div>
                        <div class="flex items-center gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <input type="checkbox" name="prescription_required" id="edit-prescription_required" value="1" class="w-5 h-5 rounded text-emerald-600 border-amber-200">
                            <label class="text-xs font-bold text-amber-800">Perlu Resep Dokter?</label>
                        </div>
                    </div>

                    <!-- Medical Info -->
                    <div class="space-y-4">
                        <h4 class="text-xs font-black text-emerald-600 uppercase tracking-widest border-b border-emerald-50 pb-2">Informasi Medis</h4>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Indikasi</label>
                            <textarea name="indication" id="edit-indication" rows="2" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Aturan Pakai</label>
                            <textarea name="usage_rules" id="edit-usage_rules" rows="2" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Komposisi</label>
                            <textarea name="composition" id="edit-composition" rows="2" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Efek Samping</label>
                            <textarea name="side_effects" id="edit-side_effects" rows="2" class="w-full px-5 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"></textarea>
                        </div>
                    </div>
                </div>

                <div class="flex gap-4 pt-4">
                    <button type="button" onclick="toggleModal('modal-edit')" class="flex-1 px-6 py-4 font-bold text-slate-500 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all">Batal</button>
                    <button type="submit" class="flex-1 px-6 py-4 font-bold text-white bg-emerald-600 rounded-2xl shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition-all">Update Data</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function toggleModal(id) {
        document.getElementById(id).classList.toggle('hidden');
    }

    function editMedicine(medicine) {
        document.getElementById('form-edit').action = `/apoteker/medicines/${medicine.id}`;
        
        // Fill simple inputs
        document.getElementById('edit-name').value = medicine.name;
        document.getElementById('edit-category').value = medicine.category;
        document.getElementById('edit-unit').value = medicine.unit || '';
        document.getElementById('edit-price').value = medicine.price;
        document.getElementById('edit-stock').value = medicine.stock;
        document.getElementById('edit-image_url').value = medicine.image_url || '';
        
        // Fill textareas
        document.getElementById('edit-indication').value = medicine.indication || '';
        document.getElementById('edit-usage_rules').value = medicine.usage_rules || '';
        document.getElementById('edit-composition').value = medicine.composition || '';
        document.getElementById('edit-side_effects').value = medicine.side_effects || '';
        
        // Checkbox
        document.getElementById('edit-prescription_required').checked = medicine.prescription_required;
        
        toggleModal('modal-edit');
    }
</script>
@endsection


