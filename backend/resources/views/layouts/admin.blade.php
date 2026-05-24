<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard - Apotek Permata</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .sidebar-item:hover { background-color: #f1f5f9; color: #1e40af; }
        .sidebar-item.active { background-color: #eff6ff; color: #1e40af; border-right: 4px solid #1e40af; }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">

    <div class="flex min-h-screen">
        <!-- Sidebar -->
        <aside class="w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50">
            <div class="p-8 flex items-center gap-3">
                <img src="{{ asset('images/logo-apotek-permata.png') }}" alt="Apotek Permata" class="w-10 h-10 rounded-xl object-contain bg-white p-1 shadow-sm">
                <span class="text-xl font-bold text-slate-800 tracking-tight">Admin Panel Apotek Permata</span>
            </div>

            <nav class="flex-1 px-4 space-y-1">
                <a href="/admin/dashboard" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('admin/dashboard') ? 'active' : '' }}">
                    <i data-lucide="layout-dashboard" class="w-5 h-5"></i>
                    <span class="font-semibold">Beranda</span>
                </a>
                <a href="/admin/users" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('admin/users*') ? 'active' : '' }}">
                    <i data-lucide="users" class="w-5 h-5"></i>
                    <span class="font-semibold">Manajemen User</span>
                </a>
                <a href="/admin/education" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('admin/education*') ? 'active' : '' }}">
                    <i data-lucide="book-open" class="w-5 h-5"></i>
                    <span class="font-semibold">Kelola Edukasi</span>
                </a>
                <a href="/admin/medicines" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('admin/medicines*') ? 'active' : '' }}">
                    <i data-lucide="package" class="w-5 h-5"></i>
                    <span class="font-semibold">Data Obat</span>
                </a>
                <a href="/admin/transactions" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('admin/transactions*') ? 'active' : '' }}">
                    <i data-lucide="history" class="w-5 h-5"></i>
                    <span class="font-semibold">Riwayat Transaksi</span>
                </a>
                <a href="/admin/reports" class="sidebar-item flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all {{ Request::is('admin/reports*') ? 'active' : '' }}">
                    <i data-lucide="bar-chart-3" class="w-5 h-5"></i>
                    <span class="font-semibold">Laporan Bisnis</span>
                </a>


            </nav>

            <div class="p-4 border-t border-slate-100">
                <div class="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 mb-4">
                    <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i data-lucide="user" class="text-blue-700 w-5 h-5"></i>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-800">{{ auth()->user()->name ?? 'Admin' }}</p>
                        <p class="text-[10px] text-slate-500">System Administrator</p>
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
                    <h2 class="text-lg font-bold text-slate-800">@yield('page_title', 'Admin Panel')</h2>
                    <p class="text-xs text-slate-500">Panel kendali utama sistem.</p>
                </div>

                <div class="flex items-center gap-4">
                    <button class="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-all relative">
                        <i data-lucide="bell" class="w-5 h-5 text-slate-600"></i>
                    </button>
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
