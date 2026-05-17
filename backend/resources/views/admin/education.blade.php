@extends('layouts.admin')

@section('page_title', 'Kelola Edukasi')

@section('content')
@if(session('success'))
    <div class="mb-6 p-4 bg-indigo-100 text-indigo-700 rounded-2xl font-bold flex items-center gap-3">
        <i data-lucide="check-circle" class="w-5 h-5"></i>
        {{ session('success') }}
    </div>
@endif

@if($errors->any())
    <div class="mb-6 p-4 bg-red-100 text-red-700 rounded-2xl font-bold space-y-1">
        <div class="flex items-center gap-3 mb-1">
            <i data-lucide="alert-circle" class="w-5 h-5"></i>
            <span>Ada kesalahan pengisian artikel:</span>
        </div>
        <ul class="list-disc list-inside text-xs font-medium ml-8">
            @foreach($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<div class="space-y-8">
    <div class="flex justify-between items-center">
        <div>
            <h3 class="font-bold text-slate-800 text-xl">Artikel Edukasi Kesehatan</h3>
            <p class="text-xs text-slate-500">Buat dan kelola konten edukasi untuk pasien</p>
        </div>
        <button onclick="toggleModal('modal-add')" class="bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-blue-800 transition-all shadow-lg shadow-blue-100">
            <i data-lucide="plus" class="w-4 h-4"></i>
            Tulis Artikel Baru
        </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        @foreach($educations as $item)
        <div class="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden group">
            <div class="h-48 bg-slate-100 relative">
                @if($item->image_url)
                <img src="{{ $item->image_url }}" alt="{{ $item->title }}" class="w-full h-full object-cover">
                @else
                <div class="w-full h-full flex items-center justify-center text-slate-300">
                    <i data-lucide="image" class="w-12 h-12"></i>
                </div>
                @endif
                <div class="absolute top-4 left-4">
                    <span class="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-blue-700 uppercase">{{ $item->category }}</span>
                </div>
            </div>
            <div class="p-8">
                <h4 class="font-bold text-slate-800 mb-2 line-clamp-2">{{ $item->title }}</h4>
                <p class="text-xs text-slate-500 mb-6 line-clamp-3 leading-relaxed">{{ $item->content }}</p>
                <div class="flex justify-between items-center pt-6 border-t border-slate-50">
                    <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Oleh: {{ $item->author ?? 'Admin' }}</p>
                    <div class="flex gap-2">
                        <button onclick="editEducation({{ $item }})" class="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
                        <form action="/admin/education/{{ $item->id }}" method="POST" onsubmit="return confirm('Hapus artikel ini?')">
                            @csrf
                            @method('DELETE')
                            <button type="submit" class="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        @endforeach
    </div>
</div>

<!-- Modal Add/Edit -->
<div id="modal-education" class="fixed inset-0 z-[60] hidden overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-slate-900/60 backdrop-blur-sm" onclick="toggleModal('modal-education')"></div>
        <div class="inline-block w-full max-w-2xl p-10 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-2xl rounded-[3rem]">
            <h3 id="modal-title" class="text-2xl font-black text-slate-800 mb-8">Tulis Edukasi Baru</h3>
            <form id="education-form" action="/admin/education" method="POST" class="space-y-6">
                @csrf
                <div id="method-field"></div>
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Judul Artikel</label>
                        <input type="text" name="title" id="form-title" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</label>
                        <input type="text" name="category" id="form-category" placeholder="Contoh: Tips Kesehatan" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Konten Artikel</label>
                    <textarea name="content" id="form-content" rows="6" required class="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
                </div>
                <div class="grid grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Link Gambar Sampul</label>
                        <input type="url" name="image_url" id="form-image" placeholder="https://..." class="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500">
                    </div>
                    <div class="space-y-2">
                        <label class="text-xs font-bold text-slate-400 uppercase tracking-widest">Penulis</label>
                        <input type="text" name="author" id="form-author" placeholder="Admin Apotek" class="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500">
                    </div>
                </div>
                <div class="pt-6 flex gap-4">
                    <button type="submit" class="flex-1 bg-blue-700 text-white py-4 rounded-2xl font-bold hover:bg-blue-800 transition-all">Simpan & Terbitkan</button>
                    <button type="button" onclick="toggleModal('modal-education')" class="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all">Batal</button>
                </div>
            </form>
        </div>
    </div>
</div>

<script>
    function toggleModal(id) {
        document.getElementById(id).classList.toggle('hidden');
    }

    function editEducation(item) {
        document.getElementById('modal-title').innerText = 'Edit Artikel Edukasi';
        document.getElementById('education-form').action = `/admin/education/${item.id}`;
        document.getElementById('method-field').innerHTML = '<input type="hidden" name="_method" value="PUT">';
        
        document.getElementById('form-title').value = item.title;
        document.getElementById('form-category').value = item.category;
        document.getElementById('form-content').value = item.content;
        document.getElementById('form-image').value = item.image_url || '';
        document.getElementById('form-author').value = item.author || '';
        
        toggleModal('modal-education');
    }

    function toggleModal(id) {
        if (id === 'modal-add') {
            document.getElementById('modal-title').innerText = 'Tulis Edukasi Baru';
            document.getElementById('education-form').action = '/admin/education';
            document.getElementById('method-field').innerHTML = '';
            document.getElementById('education-form').reset();
            id = 'modal-education';
        }
        document.getElementById(id).classList.toggle('hidden');
    }
</script>
@endsection
