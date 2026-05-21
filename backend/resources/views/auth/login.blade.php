<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Staff - Apotek Permata</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
    </style>
</head>
<body class="bg-emerald-600 min-h-screen flex items-center justify-center p-6">

    <div class="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
        <!-- Brand Side -->
        <div class="md:w-1/2 bg-emerald-50 p-12 flex flex-col justify-between relative overflow-hidden">
            <div class="relative z-10">
                <div class="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-emerald-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.673.337a4 4 0 01-1.909.477H9" />
                    </svg>
                </div>
                <h1 class="text-3xl font-extrabold text-emerald-900 leading-tight mb-4">Portal Khusus <br/>Staff Apotek</h1>
                <p class="text-emerald-700 opacity-70 text-sm leading-relaxed">Kelola pesanan, stok obat, dan konsultasi pasien dalam satu sistem yang terintegrasi.</p>
            </div>
            
            <div class="relative z-10">
                <div class="flex items-center gap-4 text-emerald-800 text-xs font-bold bg-white/50 p-4 rounded-2xl backdrop-blur-sm border border-white">
                    <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    Sistem Terenkripsi & Aman
                </div>
            </div>

            <!-- Decoration -->
            <div class="absolute -bottom-20 -left-20 w-64 h-64 bg-emerald-200 rounded-full blur-3xl opacity-50"></div>
        </div>

        <!-- Login Side -->
        <div class="md:w-1/2 p-12 md:p-16">
            <div class="mb-10">
                <h2 class="text-2xl font-bold text-slate-800 mb-2">Selamat Datang</h2>
                <p class="text-slate-500 text-sm">Masukkan kredensial anda untuk masuk.</p>
            </div>

            <form action="/login" method="POST" class="space-y-6">
                @csrf
                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                    <input type="email" name="email" value="{{ old('email') }}" required 
                        class="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                        placeholder="nama@apotek.com">
                    @error('email')
                        <p class="text-red-500 text-[10px] mt-2 ml-1 font-bold">{{ $message }}</p>
                    @enderror
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                    <div class="relative">
                        <input type="password" id="password" name="password" required 
                            class="w-full px-6 py-4 pr-14 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                            placeholder="••••••••">
                        <button type="button" onclick="togglePasswordVisibility()" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                            <svg id="eyeIcon" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="flex items-center justify-between px-1">
                    <label class="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" class="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300">
                        <span class="text-xs text-slate-500">Ingat Saya</span>
                    </label>
                    <a href="#" class="text-xs text-emerald-600 font-bold hover:underline">Lupa Password?</a>
                </div>

                <button type="submit" class="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200 hover:bg-emerald-700 hover:scale-[1.01] active:scale-95 transition-all">
                    Masuk Sekarang
                </button>
            </form>

            <p class="text-center mt-12 text-xs text-slate-400">
                Bukan Staff? <a href="/" class="text-emerald-600 font-bold">Kembali ke Beranda</a>
            </p>
        </div>
    </div>

    <script>
        function togglePasswordVisibility() {
            const passwordInput = document.getElementById('password');
            const eyeIcon = document.getElementById('eyeIcon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />';
            } else {
                passwordInput.type = 'password';
                eyeIcon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />';
            }
        }
    </script>

</body>
</html>
