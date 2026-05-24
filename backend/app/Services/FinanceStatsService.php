<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Collection;

/**
 * Perhitungan keuangan — sama dengan logika di app/apoteker/finance.tsx
 */
class FinanceStatsService
{
  private const VALID_STATUSES = [
    'perlu_diproses',
    'sedang_diproses',
    'dikirim',
    'selesai',
    'completed',
  ];

  public function isValidOrder(Order $order): bool
  {
    if ($order->payment_status === 'paid') {
      return true;
    }

    $status = strtolower(trim((string) $order->status));

    return in_array($status, self::VALID_STATUSES, true);
  }

  public function orderGrandTotal(Order $order): float
  {
    $base = (float) ($order->total_amount ?? $order->total_price ?? 0);
    $isDelivery = $order->shipping_address
      && $order->shipping_address !== 'Ambil di Apotek';

    return $base + 2000 + ($isDelivery ? 10000 : 0);
  }

  /** @return Collection<int, Order> */
  public function getValidOrders(): Collection
  {
    return Order::with(['user', 'items.medicine'])
      ->orderBy('created_at', 'desc')
      ->get()
      ->filter(fn (Order $order) => $this->isValidOrder($order))
      ->values();
  }

  public function getSummary(): array
  {
    $validOrders = $this->getValidOrders();

    $totalRevenue = (int) round($validOrders->sum(fn (Order $o) => $this->orderGrandTotal($o)));
    $totalOrders = $validOrders->count();
    $totalCustomers = $validOrders->pluck('user_id')->filter()->unique()->count();
    $totalItems = $validOrders->sum(fn (Order $o) => $o->items->count());

    $todayStr = now()->toDateString();
    $todayRevenue = (int) round(
      $validOrders
        ->filter(fn (Order $o) => $o->created_at && $o->created_at->toDateString() === $todayStr)
        ->sum(fn (Order $o) => $this->orderGrandTotal($o))
    );

    $growth = $this->calculateGrowth($validOrders);
    $chart = $this->buildWeeklyChart($validOrders);
    $bestSellers = $this->buildBestSellers($validOrders);

    return [
      'total_revenue' => $totalRevenue,
      'total_revenue_formatted' => $this->formatRupiahShort($totalRevenue),
      'total_orders' => $totalOrders,
      'total_customers' => $totalCustomers,
      'total_items' => $totalItems,
      'today_revenue' => $todayRevenue,
      'today_revenue_formatted' => $this->formatRupiahFull($todayRevenue),
      'growth' => $growth,
      'chart' => $chart,
      'best_sellers' => $bestSellers,
      'recent_orders' => $validOrders->take(15)->values()->all(),
    ];
  }

  /** Data kartu dashboard admin */
  public function getAdminDashboardPayload(): array
  {
    $summary = $this->getSummary();
    $growth = $summary['growth'];

    return [
      'stats' => [
        [
          'label' => 'Total Penjualan',
          'value' => $summary['total_revenue_formatted'],
          'raw_value' => $summary['total_revenue'],
          'icon' => 'trending-up',
          'color' => '#E8F5E9',
          'iconColor' => '#2E8B57',
        ],
        [
          'label' => 'Total Pesanan',
          'value' => (string) $summary['total_orders'],
          'raw_value' => $summary['total_orders'],
          'icon' => 'shopping-cart',
          'color' => '#E3F2FD',
          'iconColor' => '#1976D2',
        ],
        [
          'label' => 'Total Pelanggan',
          'value' => (string) $summary['total_customers'],
          'raw_value' => $summary['total_customers'],
          'icon' => 'users',
          'color' => '#F3E5F5',
          'iconColor' => '#7B1FA2',
        ],
        [
          'label' => 'Pertumbuhan',
          'value' => $growth['display'],
          'raw_value' => $growth['percent'],
          'icon' => 'activity',
          'color' => '#FFF3E0',
          'iconColor' => '#F57C00',
        ],
      ],
      'chart' => $summary['chart'],
      'best_sellers' => $summary['best_sellers'],
      'finance' => [
        'total_revenue' => $summary['total_revenue'],
        'total_orders' => $summary['total_orders'],
        'total_customers' => $summary['total_customers'],
        'total_items' => $summary['total_items'],
        'today_revenue' => $summary['today_revenue'],
        'updated_at' => now()->toIso8601String(),
      ],
    ];
  }

  private function calculateGrowth(Collection $validOrders): array
  {
    $thisWeekStart = now()->subDays(6)->startOfDay();
    $lastWeekStart = now()->subDays(13)->startOfDay();
    $lastWeekEnd = now()->subDays(6)->startOfDay();

    $revenueThisWeek = $validOrders
      ->filter(fn (Order $o) => $o->created_at && $o->created_at >= $thisWeekStart)
      ->sum(fn (Order $o) => $this->orderGrandTotal($o));

    $revenueLastWeek = $validOrders
      ->filter(
        fn (Order $o) => $o->created_at
          && $o->created_at >= $lastWeekStart
          && $o->created_at < $lastWeekEnd
      )
      ->sum(fn (Order $o) => $this->orderGrandTotal($o));

    if ($revenueLastWeek > 0) {
      $percent = (($revenueThisWeek - $revenueLastWeek) / $revenueLastWeek) * 100;
      $display = ($percent >= 0 ? '+' : '') . number_format($percent, 1, '.', '') . '%';
    } else {
      $percent = $revenueThisWeek > 0 ? 100.0 : 0.0;
      $display = $revenueThisWeek > 0 ? '+100.0%' : '+0.0%';
    }

    return [
      'percent' => round($percent, 1),
      'display' => $display,
      'revenue_this_week' => (int) round($revenueThisWeek),
      'revenue_last_week' => (int) round($revenueLastWeek),
    ];
  }

  private function buildWeeklyChart(Collection $validOrders): array
  {
    $daysIndo = [
      'Monday' => 'Sen',
      'Tuesday' => 'Sel',
      'Wednesday' => 'Rab',
      'Thursday' => 'Kam',
      'Friday' => 'Jum',
      'Saturday' => 'Sab',
      'Sunday' => 'Min',
    ];

    $chartLabels = [];
    $chartData = [];

    for ($i = 6; $i >= 0; $i--) {
      $dateObj = now()->subDays($i);
      $dateStr = $dateObj->toDateString();
      $dayNameEn = $dateObj->format('l');
      $label = $daysIndo[$dayNameEn] ?? $dateObj->format('d M');

      $dayTotal = (int) round(
        $validOrders
          ->filter(fn (Order $o) => $o->created_at && $o->created_at->toDateString() === $dateStr)
          ->sum(fn (Order $o) => $this->orderGrandTotal($o))
      );

      $chartLabels[] = $label;
      $chartData[] = $dayTotal;
    }

    return [
      'labels' => $chartLabels,
      'data' => $chartData,
    ];
  }

  /**
   * Produk terlaris — jumlah unit terjual per nama obat (sumber sama untuk dashboard & laporan).
   *
   * @return array<int, array{id: string, name: string, qty: int, sold: string, income: string}>
   */
  public function buildBestSellers(Collection $validOrders, int $limit = 5): array
  {
    $productSales = [];

    foreach ($validOrders as $order) {
      foreach ($order->items as $item) {
        $name = $item->medicine?->name ?? $item->name ?? 'Obat Terhapus';

        if (!isset($productSales[$name])) {
          $productSales[$name] = ['qty' => 0, 'income' => 0.0];
        }

        $productSales[$name]['qty'] += (int) $item->quantity;
        $productSales[$name]['income'] += (float) ($item->subtotal ?? 0);
      }
    }

    if (empty($productSales)) {
      return [];
    }

    uasort($productSales, fn (array $a, array $b) => $b['qty'] <=> $a['qty']);
    $top = array_slice($productSales, 0, $limit, true);

    $bestSellers = [];
    $rank = 1;

    foreach ($top as $name => $data) {
      $qty = $data['qty'];
      $bestSellers[] = [
        'id' => (string) $rank++,
        'name' => $name,
        'qty' => $qty,
        'sold' => number_format($qty, 0, ',', '.') . ' unit terjual',
        'income' => $this->formatRupiahShort($data['income']),
      ];
    }

    return $bestSellers;
  }

  public function formatRupiahShort(float $number): string
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

  public function formatRupiahFull(float $number): string
  {
    return 'Rp ' . number_format($number, 0, ',', '.');
  }
}
