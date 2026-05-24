<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportStatsService;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function __construct(private ReportStatsService $reportStats)
    {
    }

    public function index(Request $request)
    {
        if ($request->user()->role !== 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $this->reportStats->getReportPayload($request),
        ]);
    }
}
