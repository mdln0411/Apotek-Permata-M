<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Apotek Permata - Solusi Kesehatan Anda</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .glass { background: rgba(255, 255, 255, 0.8); backdrop-filter: blur(10px); }
    </style>
</head>
<body class="bg-slate-50 text-slate-900">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass border-b border-slate-200">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div class="flex items-center gap-2">
                <div class="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-1.909.477H9m10.428-3.142a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-1.909.477H9m9.927-4.47a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337A4 4 0 018.154 4H5" />
                    </svg>
                </div>
                <span class="text-2xl font-bold text-emerald-800 tracking-tight">Apotek Permata</span>
            </div>
            
            <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                <a href="#" class="hover:text-emerald-600 transition-colors">Layanan</a>
                <a href="#" class="hover:text-emerald-600 transition-colors">Tentang Kami</a>
                <a href="#" class="hover:text-emerald-600 transition-colors">Kontak</a>
                <a href="/login" class="bg-emerald-600 text-white px-6 py-2.5 rounded-full hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">Login Staff</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-40 pb-20 px-6">
        <div class="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
                <span class="inline-block px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                    Aplikasi Mobile Kini Tersedia
                </span>
                <h1 class="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                    Kesehatan Anda, <br/>
                    <span class="text-emerald-600">Prioritas Kami.</span>
                </h1>
                <p class="text-lg text-slate-600 mb-10 leading-relaxed">
                    Dapatkan obat-obatan berkualitas, konsultasi apoteker online, dan layanan resep digital hanya dalam satu genggaman. Cepat, aman, dan terpercaya.
                </p>
                
                <div class="flex flex-col sm:flex-row gap-4">
                    <button class="bg-slate-900 text-white px-8 py-4 rounded-2xl flex items-center gap-3 hover:scale-[1.02] transition-all">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.523 15.3414L20.1221 13.8414C20.4859 13.6312 20.4859 13.1031 20.1221 12.8929L17.523 11.3929L15.3414 12.6517L17.523 15.3414Z"></path>
                            <path d="M14.6191 11.9213L3.71445 5.62617C3.35064 5.41595 2.89531 5.67954 2.89531 6.10006V19.9001C2.89531 20.3206 3.35064 20.5842 3.71445 20.374L14.6191 14.0788L17.0601 12.6517L14.6191 11.9213Z"></path>
                        </svg>
                        <div class="text-left">
                            <p class="text-[10px] uppercase font-bold opacity-60">Get it on</p>
                            <p class="text-lg font-semibold leading-none">Google Play</p>
                        </div>
                    </button>
                    
                    <button class="bg-white border-2 border-slate-200 text-slate-900 px-8 py-4 rounded-2xl flex items-center gap-3 hover:bg-slate-50 transition-all">
                        <svg class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.1 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.07 2.47.3 3.64 2.01-.09.06-2.19 1.28-2.19 3.81 0 2.13 1.74 3.14 1.74 3.14-.04.13-.27.46-.4.8zM13 3.5c.73-.89 1.22-2.12 1.08-3.34-1.05.04-2.31.71-3.06 1.59-.67.79-1.25 2.04-1.09 3.23 1.17.09 2.34-.6 3.07-1.48z"></path>
                        </svg>
                        <div class="text-left">
                            <p class="text-[10px] uppercase font-bold opacity-60">Download on</p>
                            <p class="text-lg font-semibold leading-none">App Store</p>
                        </div>
                    </button>
                </div>
            </div>
            
            <div class="relative flex justify-center">
                <!-- Phone Mockup Frame -->
                <div class="relative w-[300px] h-[600px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl border-4 border-slate-800">
                    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl"></div>
                    <div class="w-full h-full bg-white rounded-[2.2rem] overflow-hidden relative">
                         <!-- Simplified App Screenshot Simulation -->
                         <div class="bg-emerald-600 h-24 p-6">
                             <div class="flex justify-between items-center">
                                 <div class="w-8 h-8 rounded-full bg-white/20"></div>
                                 <div class="w-8 h-8 rounded-full bg-white/20"></div>
                             </div>
                         </div>
                         <div class="p-4">
                             <div class="w-full h-10 bg-slate-100 rounded-lg mb-4"></div>
                             <div class="grid grid-cols-2 gap-3 mb-6">
                                 <div class="h-20 bg-emerald-50 rounded-xl"></div>
                                 <div class="h-20 bg-orange-50 rounded-xl"></div>
                                 <div class="h-20 bg-purple-50 rounded-xl"></div>
                                 <div class="h-20 bg-blue-50 rounded-xl"></div>
                             </div>
                             <div class="w-1/2 h-4 bg-slate-200 rounded mb-4"></div>
                             <div class="flex gap-4">
                                 <div class="w-32 h-40 bg-slate-100 rounded-xl"></div>
                                 <div class="w-32 h-40 bg-slate-100 rounded-xl"></div>
                             </div>
                         </div>
                    </div>
                </div>
                <!-- Decoration -->
                <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-200/50 rounded-full blur-3xl -z-10"></div>
                <div class="absolute -top-10 -left-10 w-64 h-64 bg-blue-200/50 rounded-full blur-3xl -z-10"></div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-white py-16 border-y border-slate-100">
        <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div class="text-center">
                <p class="text-3xl font-bold text-emerald-600">10rb+</p>
                <p class="text-slate-500 text-sm">Pengguna Aktif</p>
            </div>
            <div class="text-center">
                <p class="text-3xl font-bold text-emerald-600">500+</p>
                <p class="text-slate-500 text-sm">Jenis Obat</p>
            </div>
            <div class="text-center">
                <p class="text-3xl font-bold text-emerald-600">24/7</p>
                <p class="text-slate-500 text-sm">Layanan Chat</p>
            </div>
            <div class="text-center">
                <p class="text-3xl font-bold text-emerald-600">15m</p>
                <p class="text-slate-500 text-sm">Rata-rata Pengiriman</p>
            </div>
        </div>
    </section>

    <footer class="py-12 px-6 text-center text-slate-400 text-sm">
        <p>&copy; 2026 Apotek Permata. All rights reserved.</p>
        <p class="mt-2">Khusus Staff Apotek? <a href="/login" class="text-emerald-600 hover:underline">Klik di sini untuk Dashboard</a></p>
    </footer>

</body>
</html>
<?php /**PATH C:\Users\MyBook Hype AMD\apotek-permata\backend\resources\views/landing.blade.php ENDPATH**/ ?>