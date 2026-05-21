<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Pastikan hanya admin yang bisa akses
        if ($request->user()->role !== 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
        }

        // 1. Total Penjualan
        $totalRevenueVal = Order::whereIn('status', ['selesai', 'completed'])->sum('total_price');
        $totalRevenueShort = $this->formatRupiahShort($totalRevenueVal);

        // 2. Total Pesanan
        $totalOrdersVal = Order::count();

        // 3. Total Pelanggan
        $totalCustomersVal = User::where('role', 'member')->count();

        // 4. Pertumbuhan (Revenue 7 Hari Terakhir vs 7 Hari Sebelumnya)
        $revenueThisWeek = Order::whereIn('status', ['selesai', 'completed'])
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->sum('total_price');

        $revenueLastWeek = Order::whereIn('status', ['selesai', 'completed'])
            ->where('created_at', '>=', now()->subDays(13)->startOfDay())
            ->where('created_at', '<', now()->subDays(6)->startOfDay())
            ->sum('total_price');

        if ($revenueLastWeek > 0) {
            $growthVal = (($revenueThisWeek - $revenueLastWeek) / $revenueLastWeek) * 100;
            $growthShort = ($growthVal >= 0 ? '+' : '') . number_format($growthVal, 1, '.', '') . '%';
        } else {
            $growthShort = $revenueThisWeek > 0 ? '+100.0%' : '+0.0%';
        }

        // 5. Grafik Mingguan (7 Hari Terakhir)
        $daysIndo = [
            'Monday' => 'Sen',
            'Tuesday' => 'Sel',
            'Wednesday' => 'Rab',
            'Thursday' => 'Kam',
            'Friday' => 'Jum',
            'Saturday' => 'Sab',
            'Sunday' => 'Min',
        ];

        $sales = Order::whereIn('status', ['selesai', 'completed'])
            ->where('created_at', '>=', now()->subDays(6)->startOfDay())
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('SUM(total_price) as total')
            )
            ->groupBy('date')
            ->pluck('total', 'date');

        $chartLabels = [];
        $chartData = [];

        for ($i = 6; $i >= 0; $i--) {
            $dateObj = now()->subDays($i);
            $dateStr = $dateObj->format('Y-m-d');
            $dayNameEn = $dateObj->format('l');
            $label = $daysIndo[$dayNameEn] ?? $dateObj->format('d M');

            $chartLabels[] = $label;
            $chartData[] = (int) ($sales->get($dateStr, 0));
        }

        // 6. Produk Terlaris
        $bestSellersRaw = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereIn('orders.status', ['selesai', 'completed'])
            ->select(
                'order_items.medicine_id',
                'order_items.name',
                DB::raw('SUM(order_items.quantity) as total_sold'),
                DB::raw('SUM(order_items.subtotal) as total_income')
            )
            ->groupBy('order_items.medicine_id', 'order_items.name')
            ->orderBy('total_sold', 'desc')
            ->take(3)
            ->get();

        $bestSellers = [];
        $rank = 1;
        foreach ($bestSellersRaw as $item) {
            $bestSellers[] = [
                'id' => (string) $rank++,
                'name' => $item->name,
                'sold' => number_format($item->total_sold, 0, ',', '.') . ' terjual',
                'income' => $this->formatRupiahShort($item->total_income),
            ];
        }

        // Fallback jika belum ada best sellers sama sekali agar dasbor tidak kosong melompong
        if (empty($bestSellers)) {
            $bestSellers = [
                ['id' => '1', 'name' => 'Belum ada transaksi', 'sold' => '0 terjual', 'income' => 'Rp 0'],
            ];
        }

        return response()->json([
            'status' => 'success',
            'data' => [
                'stats' => [
                    [
                        'label' => 'Total Penjualan',
                        'value' => $totalRevenueShort,
                        'raw_value' => (int) $totalRevenueVal,
                        'icon' => 'trending-up',
                        'color' => '#E8F5E9',
                        'iconColor' => '#2E8B57'
                    ],
                    [
                        'label' => 'Total Pesanan',
                        'value' => (string) $totalOrdersVal,
                        'raw_value' => $totalOrdersVal,
                        'icon' => 'shopping-cart',
                        'color' => '#E3F2FD',
                        'iconColor' => '#1976D2'
                    ],
                    [
                        'label' => 'Total Pelanggan',
                        'value' => (string) $totalCustomersVal,
                        'raw_value' => $totalCustomersVal,
                        'icon' => 'users',
                        'color' => '#F3E5F5',
                        'iconColor' => '#7B1FA2'
                    ],
                    [
                        'label' => 'Pertumbuhan',
                        'value' => $growthShort,
                        'raw_value' => $growthShort,
                        'icon' => 'activity',
                        'color' => '#FFF3E0',
                        'iconColor' => '#F57C00'
                    ],
                ],
                'chart' => [
                    'labels' => $chartLabels,
                    'data' => $chartData,
                ],
                'best_sellers' => $bestSellers,
            ]
        ]);
    }

    private function formatRupiahShort($number)
    {
        if ($number >= 1000000000) {
            return 'Rp ' . number_format($number / 1000000000, 1, ',', '') . 'M';
        }
        if ($number >= 1000000) {
            return 'Rp ' . number_format($number / 1000000, 1, ',', '') . 'Jt';
        }
        if ($number >= 1000) {
            return 'Rp ' . number_format($number / 1000, 0, ',', '') . 'Rb';
        }
        return 'Rp ' . number_format($number, 0, ',', '.');
    }
}
