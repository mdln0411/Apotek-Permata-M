<?php $__env->startSection('page_title', 'Master Data Obat'); ?>

<?php $__env->startSection('content'); ?>
<div class="space-y-8">
    <div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div class="p-8 border-b border-slate-50 flex justify-between items-center">
            <div>
                <h3 class="font-bold text-slate-800">Inventaris Obat Global</h3>
                <p class="text-xs text-slate-500">Pantau ketersediaan stok di seluruh sistem</p>
            </div>
            <form action="/admin/medicines" method="GET" class="relative w-64">
                <i data-lucide="search" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"></i>
                <input type="text" name="q" value="<?php echo e(request('q')); ?>" placeholder="Cari obat..." class="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500 transition-all">
            </form>
        </div>
        
        <div class="overflow-x-auto">
            <table class="w-full text-left">
                <thead>
                    <tr class="text-slate-400 text-[10px] uppercase tracking-widest font-bold bg-slate-50/50">
                        <th class="px-8 py-4">Nama Obat</th>
                        <th class="px-8 py-4">Kategori</th>
                        <th class="px-8 py-4">Harga</th>
                        <th class="px-8 py-4 text-center">Stok</th>
                        <th class="px-8 py-4">Resep?</th>
                    </tr>
                </thead>
                <tbody class="text-sm divide-y divide-slate-50">
                    <?php $__currentLoopData = $medicines; $__env->addLoop($__currentLoopData); foreach($__currentLoopData as $medicine): $__env->incrementLoopIndices(); $loop = $__env->getLastLoop(); ?>
                    <tr class="hover:bg-slate-50 transition-colors">
                        <td class="px-8 py-5">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                                    <i data-lucide="pill" class="w-5 h-5"></i>
                                </div>
                                <p class="font-bold text-slate-800"><?php echo e($medicine->name); ?></p>
                            </div>
                        </td>
                        <td class="px-8 py-5 text-slate-500"><?php echo e($medicine->category); ?></td>
                        <td class="px-8 py-5 font-bold text-slate-700">Rp <?php echo e(number_format($medicine->price, 0, ',', '.')); ?></td>
                        <td class="px-8 py-5 text-center">
                            <span class="px-3 py-1 rounded-full text-[10px] font-bold <?php echo e($medicine->stock < 10 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'); ?>">
                                <?php echo e($medicine->stock); ?>

                            </span>
                        </td>
                        <td class="px-8 py-5">
                            <?php if($medicine->prescription_required): ?>
                                <span class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Wajib</span>
                            <?php else: ?>
                                <span class="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">Bebas</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                    <?php endforeach; $__env->popLoop(); $loop = $__env->getLastLoop(); ?>
                </tbody>
            </table>
        </div>
    </div>
</div>
<?php $__env->stopSection(); ?>

<?php echo $__env->make('layouts.admin', array_diff_key(get_defined_vars(), ['__data' => 1, '__path' => 1]))->render(); ?><?php /**PATH C:\Users\MyBook Hype AMD\apotek-permata\backend\resources\views/admin/medicines.blade.php ENDPATH**/ ?>