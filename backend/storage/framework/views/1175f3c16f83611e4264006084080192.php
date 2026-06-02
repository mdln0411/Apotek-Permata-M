<?php $__env->startSection('page_title', 'Ringkasan Sistem'); ?>

<?php $__env->startSection('content'); ?>
<div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
    <!-- Stats Cards -->
    <a href="/admin/users" class="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-50 flex flex-col gap-4 group hover:shadow-md transition-all cursor-pointer">
        <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 group-hover:scale-110 transition-transform">
            <i data-lucide="users" class="w-6 h-6"></i>
        </div>
        <div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Pengguna</p>
            <h3 class="text-3xl font-black text-slate-800"><?php echo e($stats['totalUsers']); ?></h3>
        </div>
    </a>

    <a href="/admin/reports" class="bg-white p-8 rounded-[2rem] shadow-sm border border-emerald-50 flex flex-col gap-4 group hover:shadow-md transition-all cursor-pointer">
        <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 group-hover:scale-110 transition-transform">
            <i data-lucide="dollar-sign" class="w-6 h-6"></i>
        </div>
        <div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Penjualan</p>
            <h3 class="text-3xl font-black text-slate-800">Rp <?php echo e(number_format($stats['totalRevenue'], 0, ',', '.')); ?></h3>
        </div>
    </a>

    <a href="/admin/medicines" class="bg-white p-8 rounded-[2rem] shadow-sm border border-amber-50 flex flex-col gap-4 group hover:shadow-md transition-all cursor-pointer">
        <div class="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-700 group-hover:scale-110 transition-transform">
            <i data-lucide="package" class="w-6 h-6"></i>
        </div>
        <div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Katalog Obat</p>
            <h3 class="text-3xl font-black text-slate-800"><?php echo e($stats['totalMedicines']); ?></h3>
        </div>
    </a>

    <a href="/admin/transactions?status=menunggu" class="bg-white p-8 rounded-[2rem] shadow-sm border border-red-50 flex flex-col gap-4 group hover:shadow-md transition-all cursor-pointer">
        <div class="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-700 group-hover:scale-110 transition-transform">
            <i data-lucide="shopping-cart" class="w-6 h-6"></i>
        </div>
        <div>
            <p class="text-slate-500 text-xs font-bold uppercase tracking-widest">Antrean Pesanan</p>
            <h3 class="text-3xl font-black text-slate-800"><?php echo e($stats['pendingOrders']); ?></h3>
        </div>
    </a>
</div>


<div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
    <!-- Recent Users -->
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 class="font-bold text-slate-800">Pengguna Baru</h3>
            <a href="/admin/users" class="text-blue-700 text-xs font-bold hover:underline">Kelola Semua</a>
        </div>
        <div class="p-4">
            <table class="w-full text-left">
                <thead>
                    <tr class="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                        <th class="px-4 py-3">Nama</th>
                        <th class="px-4 py-3">Role</th>
                        <th class="px-4 py-3 text-right">Tanggal</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    <?php $__currentLoopData = $recentUsers; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td class="px-4 py-4">
                            <p class="font-bold text-slate-700"><?php echo e($user->name); ?></p>
                            <p class="text-[10px] text-slate-400"><?php echo e($user->email); ?></p>
                        </td>
                        <td class="px-4 py-4">
                            <span class="px-3 py-1 rounded-full text-[8px] font-bold uppercase <?php echo e($user->role == 'admin' ? 'bg-blue-100 text-blue-700' : ($user->role == 'apoteker' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700')); ?>">
                                <?php echo e($user->role); ?>

                            </span>
                        </td>
                        <td class="px-4 py-4 text-right text-[10px] text-slate-400">
                            <?php echo e($user->created_at->format('d M Y')); ?>

                        </td>
                    </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Recent Orders -->
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-8 border-b border-slate-50">
            <h3 class="font-bold text-slate-800">Aktivitas Pesanan</h3>
        </div>
        <div class="p-4">
            <table class="w-full text-left">
                <thead>
                    <tr class="text-slate-400 text-[10px] uppercase tracking-widest font-bold">
                        <th class="px-4 py-3">Order #</th>
                        <th class="px-4 py-3">Pasien</th>
                        <th class="px-4 py-3 text-right">Total</th>
                    </tr>
                </thead>
                <tbody class="text-sm">
                    <?php $__currentLoopData = $recentOrders; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $order): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr class="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td class="px-4 py-4 font-black text-slate-700">#<?php echo e($order->order_number); ?></td>
                        <td class="px-4 py-4 text-slate-600"><?php echo e($order->user->name); ?></td>
                        <td class="px-4 py-4 text-right font-bold text-emerald-600">
                            Rp <?php echo e(number_format($order->total_price, 0, ',', '.')); ?>

                        </td>
                    </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\MyBook Hype AMD\apotek-permata\backend\resources\views/admin/dashboard.blade.php ENDPATH**/ ?>