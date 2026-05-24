<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apoteker Dashboard - Apotek Permata</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .sidebar-item:hover { background-color: #f1f5f9; color: #059669; }
        .sidebar-item.active { background-color: #ecfdf5; color: #059669; border-right: 4px solid #059669; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">

    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <aside class="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50">
            <div class="p-8 flex items-center gap-3">
                <img src="{{ asset('images/logo-apotek-permata.png') }}" alt="Apotek Permata" class="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-sm">
                <span class="text-xl font-bold text-slate-800 tracking-tight">Apotek Permata Staff</span>
            </div>

            <nav class="flex-1 px-4 space-y-1">
                <a href="/apoteker/dashboard" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('apoteker/dashboard') ? 'active' : '' }}">
                    <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                    <span class="font-semibold">Beranda</span>
                </a>
                <a href="/apoteker/orders" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('apoteker/orders*') ? 'active' : '' }}">
                    <i data-lucide="shopping-cart" class="w-5 h-5"></i>
                    <span class="font-semibold">Validasi Pesanan</span>
                </a>
                <a href="/apoteker/medicines" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('apoteker/medicines*') ? 'active' : '' }}">
                    <i data-lucide="package" class="w-5 h-5"></i>
                    <span class="font-semibold">Manajemen Stok</span>
                </a>
                <a href="/apoteker/prescriptions" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('apoteker/prescriptions*') ? 'active' : '' }}">
                    <i data-lucide="file-text" class="w-5 h-5"></i>
                    <span class="font-semibold">Resep Digital</span>
                </a>
                <a href="/apoteker/chat" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('apoteker/chat*') ? 'active' : '' }}">
                    <i data-lucide="message-square" class="w-5 h-5"></i>
                    <span class="font-semibold flex-1">Konsultasi</span>
                    @php
                        $unreadCount = \App\Models\Message::where('is_read', false)
                            ->where('sender_id', '!=', auth()->id())
                            ->count();
                    @endphp
                    @if($unreadCount > 0)
                        <span class="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-auto">{{ $unreadCount }}</span>
                    @endif
                </a>
                <a href="/apoteker/reports" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('apoteker/reports*') ? 'active' : '' }}">
                    <i data-lucide="pie-chart" class="w-5 h-5"></i>
                    <span class="font-semibold">Laporan Keuangan</span>
                </a>


            </nav>

            <div class="p-4 border-t border-slate-100">
                <div class="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <i data-lucide="user" class="text-emerald-600 w-5 h-5"></i>
                    </div>
                    <div>
                    <div>
                        <p class="text-xs font-bold text-slate-800">{{ auth()->user()->name ?? 'Apoteker' }}</p>
                        <p class="text-[10px] text-slate-500">Apoteker Staff</p>
                    </div>
                </div>
                <a href="/logout" class="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm font-bold">
                    <i data-lucide="log-out" class="w-4 h-4"></i>
                    Keluar
                </a>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="flex-1 ml-72">
            <!-- Top Header -->
            <header class="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-40 px-10 flex items-center justify-between">
                <div>
                    <h2 class="text-lg font-bold text-slate-800">@yield('page_title', 'Dashboard')</h2>
                    <p class="text-xs text-slate-500">Selamat datang kembali, {{ auth()->user()->name ?? 'Apoteker' }}!</p>
                </div>


                <div class="flex items-center gap-4">
                    @php
                        $newOrders = \App\Models\Order::where('status', 'menunggu')->count();
                        $unreadMsgs = \App\Models\Message::where('is_read', false)->where('sender_id', '!=', auth()->id())->count();
                        $totalNotif = $newOrders + $unreadMsgs;
                    @endphp
                    <div class="relative group">
                        <button class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all relative">
                            <i data-lucide="bell" class="w-5 h-5 text-slate-600"></i>
                            @if($totalNotif > 0)
                                <span class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            @endif
                        </button>
                        
                        <!-- Notification Dropdown -->
                        <div class="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div class="px-6 mb-4">
                                <h4 class="font-bold text-slate-800 text-sm">Pemberitahuan</h4>
                            </div>
                            <div class="space-y-1">
                                <a href="/apoteker/orders" class="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-all">
                                    <div class="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">
                                        <i data-lucide="shopping-bag" class="w-4 h-4"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-xs font-bold text-slate-700">{{ $newOrders }} Pesanan Baru</p>
                                        <p class="text-[10px] text-slate-400">Menunggu validasi anda</p>
                                    </div>
                                </a>
                                <a href="/apoteker/chat" class="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 transition-all">
                                    <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <i data-lucide="message-circle" class="w-4 h-4"></i>
                                    </div>
                                    <div class="flex-1">
                                        <p class="text-xs font-bold text-slate-700">{{ $unreadMsgs }} Chat Belum Dibaca</p>
                                        <p class="text-[10px] text-slate-400">Pasien menunggu balasan</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div class="h-8 w-px bg-slate-200 mx-2"></div>
                    <p class="text-sm font-semibold text-slate-700">{{ date('d M Y') }}</p>
                </div>

            </header>

            <div class="p-10">
                @yield('content')
            </div>
        </main>
    </div>

    <script>
        lucide.createIcons();
    </script>
</body>
</html>
