<?php $__env->startSection('page_title', 'Manajemen Pengguna'); ?>

<?php $__env->startSection('content'); ?>
<?php if(session('success')): ?>
    <div class="mb-6 p-4 bg-indigo-100 text-indigo-700 rounded-2xl font-bold flex items-center gap-3">
        <i data-lucide="check-circle" class="w-5 h-5"></i>
        <?php echo e(session('success')); ?>

    </div>
<?php endif; ?>

<?php if(session('error')): ?>
    <div class="mb-6 p-4 bg-red-100 text-red-700 rounded-2xl font-bold flex items-center gap-3">
        <i data-lucide="alert-circle" class="w-5 h-5"></i>
        <?php echo e(session('error')); ?>

    </div>
<?php endif; ?>

<div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
    <div class="p-8 border-b border-slate-50 flex justify-between items-center">
        <div>
            <h3 class="font-bold text-slate-800">Daftar Semua Pengguna</h3>
            <p class="text-xs text-slate-500">Kelola hak akses dan peran staf atau pelanggan</p>
        </div>
        <div class="relative w-64">
            <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
            <input type="text" placeholder="Cari user..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all">
        </div>
    </div>
    
    <div class="overflow-x-auto">
        <table class="w-full text-left">
            <thead>
                <tr class="text-slate-400 text-[10px] uppercase tracking-widest font-bold bg-slate-50/50">
                    <th class="px-8 py-4">Informasi User</th>
                    <th class="px-8 py-4">Peran (Role)</th>
                    <th class="px-8 py-4">Bergabung Pada</th>
                    <th class="px-8 py-4 text-right">Aksi</th>
                </tr>
            </thead>
            <tbody class="text-sm divide-y divide-slate-50">
                <?php $__currentLoopData = $users; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $user): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-8 py-5">
                        <div class="flex items-center gap-4">
                            <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold uppercase">
                                <?php echo e(substr($user->name, 0, 1)); ?>

                            </div>
                            <div>
                                <p class="font-bold text-slate-800"><?php echo e($user->name); ?></p>
                                <p class="text-[10px] text-slate-400"><?php echo e($user->email); ?></p>
                            </div>
                        </div>
                    </td>
                    <td class="px-8 py-5">
                        <form action="/admin/users/<?php echo e($user->id); ?>/role" method="POST">
                            <?php echo csrf_field(); ?>
                            <select name="role" onchange="this.form.submit()" class="bg-slate-50 border border-slate-200 text-[10px] font-bold rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="member" <?php echo e($user->role == 'member' ? 'selected' : ''); ?>>MEMBER (Pasien)</option>
                                <option value="apoteker" <?php echo e($user->role == 'apoteker' ? 'selected' : ''); ?>>APOTEKER (Staff)</option>
                                <option value="admin" <?php echo e($user->role == 'admin' ? 'selected' : ''); ?>>ADMIN (Super)</option>
                            </select>
                        </form>
                    </td>
                    <td class="px-8 py-5 text-slate-500">
                        <?php echo e($user->created_at->format('d M Y')); ?>

                    </td>
                    <td class="px-8 py-5 text-right">
                        <form action="/admin/users/<?php echo e($user->id); ?>" method="POST" onsubmit="return confirm('Apakah anda yakin ingin menghapus user ini? Semua data terkait (pesanan, chat) akan ikut terhapus.')">
                            <?php echo csrf_field(); ?>
                            <?php echo method_field('DELETE'); ?>
                            <button type="submit" class="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all <?php echo e($user->id == auth()->id() ? 'opacity-0 pointer-events-none' : ''); ?>">
                                <i data-lucide="trash-2" class="w-4 h-4"></i>
                            </button>
                        </form>
                    </td>
                </tr>
                <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
            </tbody>
        </table>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\MyBook Hype AMD\apotek-permata\backend\resources\views/admin/users.blade.php ENDPATH**/ ?>