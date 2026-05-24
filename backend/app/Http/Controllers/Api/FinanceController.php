<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FinanceStatsService;
use Illuminate\Http\Request;

class FinanceController extends Controller
{
  public function __construct(private FinanceStatsService $financeStats)
  {
  }

  /**
   * Ringkasan keuangan — dipakai apoteker & admin (sumber data sama)
   */
  public function summary(Request $request)
  {
    $role = $request->user()->role;
    if (!in_array($role, ['admin', 'apoteker'], true)) {
      return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
    }

    $summary = $this->financeStats->getSummary();

    return response()->json([
      'status' => 'success',
      'data' => $summary,
    ]);
  }
}
