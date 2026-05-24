<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FinanceStatsService;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
  public function __construct(private FinanceStatsService $financeStats)
  {
  }

  public function index(Request $request)
  {
    if ($request->user()->role !== 'admin') {
      return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
    }

    return response()->json([
      'status' => 'success',
      'data' => $this->financeStats->getAdminDashboardPayload(),
    ]);
  }
}
