<?php

namespace App\Services;

use App\Models\Medicine;
use App\Models\Order;
use App\Models\User;
use App\Support\IndonesianDateTime;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ReportStatsService
{
    public function __construct(private FinanceStatsService $financeStats)
    {
    }

    public function getReportPayload(Request $request): array
    {
        [$rangeStart, $rangeEnd, $period] = $this->resolveDateRange($request);

        $baseQuery = $this->buildFilteredQuery($request, $rangeStart, $rangeEnd);
        $orders = (clone $baseQuery)
            ->with(['user', 'items.medicine', 'processedBy'])
            ->orderBy('created_at', $request->input('sort', 'desc') === 'asc' ? 'asc' : 'desc')
            ->get();

        $validOrders = $orders->filter(fn (Order $o) => $this->financeStats->isValidOrder($o))->values();
        $allOrdersInRange = $orders;

        return [
            'period' => $period,
            'date_from' => $rangeStart->toDateString(),
            'date_to' => $rangeEnd->toDateString(),
            'summary' => $this->buildSummaryCards($validOrders, $allOrdersInRange),
            'charts' => $this->buildCharts($validOrders, $rangeStart, $rangeEnd),
            'pharmacist_activity' => $this->buildPharmacistActivity($rangeStart, $rangeEnd),
            'payment_stats' => $this->buildPaymentStats($allOrdersInRange),
            'order_stats' => $this->buildOrderStats($allOrdersInRange),
            'user_stats' => $this->buildUserStats(),
            'transactions' => $this->paginateTransactions($request, $this->buildAllOrdersQuery($request)),
            'filter_options' => $this->getFilterOptions(),
            'generated_at' => IndonesianDateTime::toIso8601(now()),
        ];
    }

    /** @return array{0: Carbon, 1: Carbon, 2: string} */
    private function resolveDateRange(Request $request): array
    {
        $period = $request->input('period', 'month');

        if ($period === 'custom' && $request->filled('date_from') && $request->filled('date_to')) {
            $start = Carbon::parse($request->input('date_from'))->startOfDay();
            $end = Carbon::parse($request->input('date_to'))->endOfDay();

            return [$start, $end, 'custom'];
        }

        return match ($period) {
            'today' => [now()->startOfDay(), now()->endOfDay(), 'today'],
            'week' => [now()->startOfWeek(), now()->endOfWeek(), 'week'],
            'year' => [now()->startOfYear(), now()->endOfYear(), 'year'],
            default => [now()->startOfMonth(), now()->endOfMonth(), 'month'],
        };
    }

    private function buildFilteredQuery(Request $request, Carbon $start, Carbon $end): Builder
    {
        return $this->applyOrderListFilters(
            Order::query()->whereBetween('created_at', [$start, $end]),
            $request,
        );
    }

    /** Semua pesanan — sama dengan daftar transaksi admin (tanpa filter periode). */
    private function buildAllOrdersQuery(Request $request): Builder
    {
        return $this->applyOrderListFilters(Order::query(), $request);
    }

    private function applyOrderListFilters(Builder $query, Request $request): Builder
    {
        if ($request->filled('apoteker_id')) {
            $query->where('processed_by', $request->input('apoteker_id'));
        }

        if ($request->filled('payment_method')) {
            $this->applyPaymentMethodFilter($query, $request->input('payment_method'));
        }

        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        if ($request->filled('search')) {
            $search = '%' . trim($request->input('search')) . '%';
            $query->where(function (Builder $q) use ($search) {
                $q->where('order_number', 'like', $search)
                    ->orWhereHas('user', fn (Builder $u) => $u->where('name', 'like', $search));
            });
        }

        return $query;
    }

    private function buildSummaryCards(Collection $validOrders, Collection $allOrders): array
    {
        $todayStart = now()->startOfDay();
        $weekStart = now()->startOfWeek();
        $monthStart = now()->startOfMonth();

        $revenueFn = fn (Order $o) => $this->financeStats->orderGrandTotal($o);

        $totalRevenue = (int) round($validOrders->sum($revenueFn));
        $completed = $allOrders->filter(fn (Order $o) => in_array(strtolower($o->status), ['selesai', 'completed'], true));
        $processing = $allOrders->filter(fn (Order $o) => in_array(strtolower($o->status), ['perlu_diproses', 'sedang_diproses', 'dikirim', 'menunggu_konfirmasi'], true));
        $cancelled = $allOrders->filter(fn (Order $o) => in_array(strtolower($o->status), ['dibatalkan', 'dilaporkan'], true));

        $totalUsers = User::where('role', 'member')->count();
        $totalProducts = Medicine::count();
        $lowStock = Medicine::where('stock', '<', 10)->count();
        $activePharmacists = User::where('role', 'apoteker')->where('is_active', true)->count();

        return [
            $this->metricCard('total_revenue', 'Total Pendapatan', $totalRevenue, 'currency', '#2E8B57', '#E8F5E9', 'trending-up', $validOrders, $revenueFn, $todayStart, $weekStart, $monthStart),
            $this->metricCard('total_orders', 'Total Pesanan', $allOrders->count(), 'number', '#1976D2', '#E3F2FD', 'shopping-cart', $allOrders, fn () => 1, $todayStart, $weekStart, $monthStart),
            $this->metricCard('completed_orders', 'Pesanan Selesai', $completed->count(), 'number', '#388E3C', '#E8F5E9', 'check-circle', $completed, fn () => 1, $todayStart, $weekStart, $monthStart),
            $this->metricCard('processing_orders', 'Pesanan Diproses', $processing->count(), 'number', '#F57C00', '#FFF3E0', 'clock', $processing, fn () => 1, $todayStart, $weekStart, $monthStart),
            $this->metricCard('cancelled_orders', 'Pesanan Dibatalkan', $cancelled->count(), 'number', '#D32F2F', '#FFEBEE', 'x-circle', $cancelled, fn () => 1, $todayStart, $weekStart, $monthStart),
            $this->metricCard('total_users', 'Jumlah Pengguna', $totalUsers, 'number', '#7B1FA2', '#F3E5F5', 'users', collect(), fn () => 0, $todayStart, $weekStart, $monthStart, false),
            $this->metricCard('total_products', 'Jumlah Produk', $totalProducts, 'number', '#00838F', '#E0F7FA', 'package', collect(), fn () => 0, $todayStart, $weekStart, $monthStart, false),
            $this->metricCard('low_stock', 'Produk Hampir Habis', $lowStock, 'number', '#EF6C00', '#FFF3E0', 'alert-triangle', collect(), fn () => 0, $todayStart, $weekStart, $monthStart, false),
            $this->metricCard('active_pharmacists', 'Apoteker Aktif', $activePharmacists, 'number', '#5D4037', '#EFEBE9', 'user-check', collect(), fn () => 0, $todayStart, $weekStart, $monthStart, false),
        ];
    }

    private function metricCard(
        string $key,
        string $label,
        int|float $value,
        string $format,
        string $iconColor,
        string $bgColor,
        string $icon,
        Collection $orders,
        callable $valueFn,
        Carbon $todayStart,
        Carbon $weekStart,
        Carbon $monthStart,
        bool $computePeriods = true,
    ): array {
        $todayVal = 0;
        $weekVal = 0;
        $monthVal = 0;
        $changePercent = 0.0;

        if ($computePeriods && $orders->isNotEmpty()) {
            $todayVal = (int) round($orders->filter(fn (Order $o) => $o->created_at >= $todayStart)->sum($valueFn));
            $weekVal = (int) round($orders->filter(fn (Order $o) => $o->created_at >= $weekStart)->sum($valueFn));
            $monthVal = (int) round($orders->filter(fn (Order $o) => $o->created_at >= $monthStart)->sum($valueFn));

            $prevWeekStart = now()->subWeek()->startOfWeek();
            $prevWeekEnd = now()->subWeek()->endOfWeek();
            $thisWeek = $orders->filter(fn (Order $o) => $o->created_at >= $weekStart)->sum($valueFn);
            $lastWeek = $orders->filter(fn (Order $o) => $o->created_at >= $prevWeekStart && $o->created_at <= $prevWeekEnd)->sum($valueFn);
            $changePercent = $lastWeek > 0
                ? round((($thisWeek - $lastWeek) / $lastWeek) * 100, 1)
                : ($thisWeek > 0 ? 100.0 : 0.0);
        }

        return [
            'key' => $key,
            'label' => $label,
            'value' => $value,
            'value_formatted' => $format === 'currency'
                ? $this->financeStats->formatRupiahFull($value)
                : (string) $value,
            'icon' => $icon,
            'icon_color' => $iconColor,
            'bg_color' => $bgColor,
            'today' => $todayVal,
            'today_formatted' => $format === 'currency'
                ? $this->financeStats->formatRupiahShort($todayVal)
                : (string) $todayVal,
            'week' => $weekVal,
            'week_formatted' => $format === 'currency'
                ? $this->financeStats->formatRupiahShort($weekVal)
                : (string) $weekVal,
            'month' => $monthVal,
            'month_formatted' => $format === 'currency'
                ? $this->financeStats->formatRupiahShort($monthVal)
                : (string) $monthVal,
            'change_percent' => $changePercent,
            'change_display' => ($changePercent >= 0 ? '+' : '') . number_format($changePercent, 1) . '%',
            'trend' => $changePercent >= 0 ? 'up' : 'down',
        ];
    }

    private function buildCharts(Collection $validOrders, Carbon $start, Carbon $end): array
    {
        return [
            'revenue_line' => $this->buildRevenueLineChart($validOrders, $start, $end),
            'best_sellers_bar' => $this->buildBestSellersBar($validOrders),
            'order_status_pie' => $this->buildOrderStatusPie($validOrders),
            'weekly_transactions_area' => $this->buildWeeklyTransactionsArea($validOrders),
            'monthly_revenue' => $this->buildMonthlyRevenue($validOrders),
        ];
    }

    private function buildRevenueLineChart(Collection $validOrders, Carbon $start, Carbon $end): array
    {
        $days = min($start->diffInDays($end) + 1, 31);
        $labels = [];
        $data = [];

        for ($i = 0; $i < $days; $i++) {
            $date = $start->copy()->addDays($i);
            if ($date->gt($end)) {
                break;
            }
            $dateStr = $date->toDateString();
            $labels[] = $date->format('d M');
            $data[] = (int) round(
                $validOrders
                    ->filter(fn (Order $o) => $o->created_at && $o->created_at->toDateString() === $dateStr)
                    ->sum(fn (Order $o) => $this->financeStats->orderGrandTotal($o))
            );
        }

        return ['labels' => $labels, 'data' => $data];
    }

    private function buildBestSellersBar(Collection $validOrders): array
    {
        $best = $this->financeStats->buildBestSellers($validOrders, 8);

        return [
            'labels' => array_map(fn (array $b) => mb_strlen($b['name']) > 14 ? mb_substr($b['name'], 0, 12) . '…' : $b['name'], $best),
            'data' => array_map(fn (array $b) => $b['qty'], $best),
            'full_names' => array_map(fn (array $b) => $b['name'], $best),
        ];
    }

    private function buildOrderStatusPie(Collection $orders): array
    {
        $groups = [
            'Selesai' => ['selesai', 'completed'],
            'Diproses' => ['perlu_diproses', 'sedang_diproses', 'menunggu_konfirmasi'],
            'Dikirim' => ['dikirim'],
            'Menunggu Bayar' => ['menunggu_pembayaran'],
            'Dibatalkan' => ['dibatalkan', 'dilaporkan'],
        ];

        $colors = ['#2E8B57', '#1976D2', '#F57C00', '#9E9E9E', '#D32F2F'];
        $labels = [];
        $data = [];
        $chartColors = [];
        $i = 0;

        foreach ($groups as $label => $statuses) {
            $count = $orders->filter(fn (Order $o) => in_array(strtolower($o->status), $statuses, true))->count();
            if ($count > 0) {
                $labels[] = $label;
                $data[] = $count;
                $chartColors[] = $colors[$i % count($colors)];
            }
            $i++;
        }

        if (empty($data)) {
            return ['labels' => ['Belum ada data'], 'data' => [1], 'colors' => ['#E0E0E0']];
        }

        return ['labels' => $labels, 'data' => $data, 'colors' => $chartColors];
    }

    private function buildWeeklyTransactionsArea(Collection $validOrders): array
    {
        $daysIndo = ['Mon' => 'Sen', 'Tue' => 'Sel', 'Wed' => 'Rab', 'Thu' => 'Kam', 'Fri' => 'Jum', 'Sat' => 'Sab', 'Sun' => 'Min'];
        $labels = [];
        $data = [];

        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dateStr = $date->toDateString();
            $labels[] = $daysIndo[$date->format('D')] ?? $date->format('d/m');
            $data[] = $validOrders->filter(fn (Order $o) => $o->created_at && $o->created_at->toDateString() === $dateStr)->count();
        }

        return ['labels' => $labels, 'data' => $data];
    }

    private function buildMonthlyRevenue(Collection $validOrders): array
    {
        $labels = [];
        $data = [];

        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $labels[] = $month->translatedFormat('M Y');
            $data[] = (int) round(
                $validOrders
                    ->filter(fn (Order $o) => $o->created_at && $o->created_at->format('Y-m') === $month->format('Y-m'))
                    ->sum(fn (Order $o) => $this->financeStats->orderGrandTotal($o))
            );
        }

        return ['labels' => $labels, 'data' => $data];
    }

    private function buildPharmacistActivity(Carbon $start, Carbon $end): array
    {
        $apotekers = User::where('role', 'apoteker')->get();

        return $apotekers->map(function (User $apoteker) use ($start, $end) {
            $processed = Order::where('processed_by', $apoteker->id)
                ->whereBetween('created_at', [$start, $end])
                ->count();

            $verified = Order::where('processed_by', $apoteker->id)
                ->where('payment_status', 'paid')
                ->whereBetween('created_at', [$start, $end])
                ->count();

            return [
                'id' => $apoteker->id,
                'name' => $apoteker->name,
                'is_active' => (bool) $apoteker->is_active,
                'orders_processed' => $processed,
                'payments_verified' => $verified,
            ];
        })->sortByDesc('orders_processed')->values()->all();
    }

    private function buildPaymentStats(Collection $orders): array
    {
        $categories = $this->paymentMethodCategories();
        $stats = [];

        foreach ($categories as $category) {
            $filtered = $orders->filter(
                fn (Order $o) => $this->normalizePaymentMethod($o->payment_method) === $category['key']
            );

            $stats[] = [
                'method' => $category['key'],
                'label' => $category['label'],
                'count' => $filtered->count(),
                'revenue' => (int) round($filtered->sum(fn (Order $o) => $this->financeStats->orderGrandTotal($o))),
            ];
        }

        $byStatus = [
            ['status' => 'paid', 'label' => 'Lunas', 'count' => $orders->where('payment_status', 'paid')->count()],
            ['status' => 'waiting_confirmation', 'label' => 'Menunggu Konfirmasi', 'count' => $orders->where('payment_status', 'waiting_confirmation')->count()],
            ['status' => 'pending', 'label' => 'Belum Bayar', 'count' => $orders->where('payment_status', 'pending')->count()],
        ];

        return ['by_method' => $stats, 'by_status' => $byStatus];
    }

    private function buildOrderStats(Collection $orders): array
    {
        $statuses = [
            'menunggu_pembayaran', 'menunggu_konfirmasi', 'perlu_diproses',
            'sedang_diproses', 'dikirim', 'selesai', 'dibatalkan', 'dilaporkan',
        ];

        return collect($statuses)->map(fn (string $s) => [
            'status' => $s,
            'count' => $orders->filter(fn (Order $o) => strtolower($o->status) === $s)->count(),
        ])->filter(fn (array $r) => $r['count'] > 0)->values()->all();
    }

    private function buildUserStats(): array
    {
        return [
            'total' => User::where('role', 'member')->count(),
            'new_this_month' => User::where('role', 'member')
                ->where('created_at', '>=', now()->startOfMonth())
                ->count(),
            'active_pharmacists' => User::where('role', 'apoteker')->where('is_active', true)->count(),
            'total_admins' => User::where('role', 'admin')->count(),
        ];
    }

    private function paginateTransactions(Request $request, Builder $query): array
    {
        $perPage = min((int) $request->input('per_page', 50), 100);
        $page = max((int) $request->input('page', 1), 1);

        $sortDir = $request->input('sort', 'desc') === 'asc' ? 'asc' : 'desc';

        $paginated = (clone $query)
            ->with(['user', 'items.medicine', 'processedBy'])
            ->orderByRaw(
                "COALESCE(completed_at, updated_at, created_at) {$sortDir}",
            )
            ->paginate($perPage, ['*'], 'page', $page);

        $items = collect($paginated->items())->map(fn (Order $order) => $this->formatTransaction($order))->all();

        return [
            'data' => $items,
            'pagination' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ];
    }

    private function formatTransaction(Order $order): array
    {
        $items = $order->items->map(fn ($item) => [
            'name' => $item->medicine?->name ?? $item->name ?? 'Obat',
            'quantity' => (int) $item->quantity,
            'price' => (float) $item->price,
            'subtotal' => (float) $item->subtotal,
        ])->all();

        $completedAt = $order->transactionCompletedAt();

        return [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'patient_name' => $order->user?->name ?? '—',
            'apoteker_name' => $order->processedBy?->name ?? 'Tim Apotek',
            'created_at' => IndonesianDateTime::toIso8601($order->created_at),
            'created_at_formatted' => IndonesianDateTime::format($order->created_at),
            'transaction_at' => IndonesianDateTime::toIso8601($completedAt),
            'transaction_at_formatted' => $completedAt
                ? IndonesianDateTime::format($completedAt)
                : null,
            'total' => $this->financeStats->orderGrandTotal($order),
            'total_formatted' => $this->financeStats->formatRupiahFull($this->financeStats->orderGrandTotal($order)),
            'payment_method' => $order->payment_method ?? '—',
            'payment_status' => $order->payment_status ?? 'pending',
            'order_status' => $order->status,
            'item_count' => $order->items->count(),
            'items' => $items,
        ];
    }

    private function getFilterOptions(): array
    {
        return [
            'apotekers' => User::where('role', 'apoteker')
                ->select('id', 'name')
                ->orderBy('name')
                ->get()
                ->map(fn (User $u) => ['id' => $u->id, 'name' => $u->name])
                ->all(),
            'payment_methods' => collect($this->paymentMethodCategories())
                ->map(fn (array $category) => [
                    'value' => $category['key'],
                    'label' => $category['label'],
                ])
                ->all(),
            'statuses' => [
                ['value' => 'menunggu_pembayaran', 'label' => 'Menunggu Pembayaran'],
                ['value' => 'menunggu_konfirmasi', 'label' => 'Menunggu Konfirmasi'],
                ['value' => 'perlu_diproses', 'label' => 'Perlu Diproses'],
                ['value' => 'sedang_diproses', 'label' => 'Sedang Diproses'],
                ['value' => 'dikirim', 'label' => 'Dikirim'],
                ['value' => 'selesai', 'label' => 'Selesai'],
                ['value' => 'dibatalkan', 'label' => 'Dibatalkan'],
            ],
            'periods' => [
                ['value' => 'today', 'label' => 'Hari Ini'],
                ['value' => 'week', 'label' => 'Minggu Ini'],
                ['value' => 'month', 'label' => 'Bulan Ini'],
                ['value' => 'year', 'label' => 'Tahun Ini'],
                ['value' => 'custom', 'label' => 'Custom Tanggal'],
            ],
        ];
    }

    /** @return array<int, array{key: string, label: string}> */
    private function paymentMethodCategories(): array
    {
        return [
            ['key' => 'QRIS', 'label' => 'QRIS'],
            ['key' => 'Transfer Bank', 'label' => 'Transfer Bank'],
            ['key' => 'DANA', 'label' => 'DANA'],
            ['key' => 'Tunai', 'label' => 'Tunai'],
        ];
    }

    private function normalizePaymentMethod(?string $paymentMethod): string
    {
        if (Order::isCodPayment($paymentMethod, null)) {
            return 'Tunai';
        }

        $pm = strtoupper(trim((string) ($paymentMethod ?? '')));

        if ($pm === '' || $pm === '—') {
            return 'QRIS';
        }

        if (str_contains($pm, 'QRIS')) {
            return 'QRIS';
        }

        if (str_contains($pm, 'DANA')) {
            return 'DANA';
        }

        if (str_contains($pm, 'BANK') || str_contains($pm, 'TRANSFER')) {
            return 'Transfer Bank';
        }

        if (str_contains($pm, 'TUNAI') || str_contains($pm, 'CASH')) {
            return 'Tunai';
        }

        return 'QRIS';
    }

    private function applyPaymentMethodFilter(Builder $query, string $paymentMethod): void
    {
        $category = $this->normalizePaymentMethod($paymentMethod);

        $query->where(function (Builder $q) use ($category) {
            match ($category) {
                'QRIS' => $q->where(function (Builder $sub) {
                    $sub->whereNull('payment_method')
                        ->orWhere('payment_method', '')
                        ->orWhere('payment_method', 'like', '%QRIS%');
                }),
                'DANA' => $q->where('payment_method', 'like', '%DANA%'),
                'Transfer Bank' => $q->where(function (Builder $sub) {
                    $sub->where('payment_method', 'like', '%Transfer%')
                        ->orWhere('payment_method', 'like', '%Bank%');
                }),
                'Tunai' => $q->where(function (Builder $sub) {
                    $sub->where('payment_method', 'like', '%Tunai%')
                        ->orWhere('payment_method', 'like', '%Cash%')
                        ->orWhere('payment_method', 'like', '%COD%')
                        ->orWhere('payment_method', 'like', '%Bayar di Apotek%');
                }),
                default => $q->where('payment_method', $category),
            };
        });
    }
}
