<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    /**
     * GET /api/medicines
     * List katalog obat (ringkas) dengan search, filter kategori, dan pagination.
     */
    public function index(Request $request)
    {
        $query = Medicine::query();

        // --- SEARCH berdasarkan nama obat ---
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // --- FILTER berdasarkan kategori ---
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // --- FILTER perlu resep atau tidak ---
        if ($request->has('prescription_required')) {
            $query->where('prescription_required', filter_var($request->prescription_required, FILTER_VALIDATE_BOOLEAN));
        }

        // --- PAGINATION (default 10 per halaman) ---
        $perPage = $request->get('per_page', 10);
        $medicines = $query
            ->orderBy('name')
            ->paginate($perPage);

        // --- Format response ringkas untuk halaman katalog ---
        return response()->json([
            'status'  => 'success',
            'message' => 'Data obat berhasil diambil',
            'data'    => $medicines->getCollection()->map(function ($medicine) {
                return [
                    'id'                   => $medicine->id,
                    'name'                 => $medicine->name,
                    'category'             => $medicine->category,
                    'unit'                 => $medicine->unit,
                    'price'                => $medicine->price,
                    'price_formatted'      => 'Rp ' . number_format($medicine->price, 0, ',', '.'),
                    'stock'                => $medicine->stock,
                    'image_url'            => $medicine->image_url,
                    'prescription_required' => $medicine->prescription_required,
                ];
            }),
            'pagination' => [
                'current_page' => $medicines->currentPage(),
                'last_page'    => $medicines->lastPage(),
                'per_page'     => $medicines->perPage(),
                'total'        => $medicines->total(),
                'has_more'     => $medicines->hasMorePages(),
            ],
        ]);
    }

    /**
     * GET /api/medicines/{id}
     * Detail lengkap satu obat.
     */
    public function show($id)
    {
        $medicine = Medicine::find($id);

        if (!$medicine) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Obat tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status'  => 'success',
            'message' => 'Detail obat berhasil diambil',
            'data'    => [
                'id'                    => $medicine->id,
                'name'                  => $medicine->name,
                'category'              => $medicine->category,
                'indication'            => $medicine->indication,
                'unit'                  => $medicine->unit,
                'price'                 => $medicine->price,
                'price_formatted'       => 'Rp ' . number_format($medicine->price, 0, ',', '.'),
                'price_detail'          => $medicine->price_detail,
                'stock'                 => $medicine->stock,
                'usage_rules'           => $medicine->usage_rules,
                'dosage'                => $medicine->dosage,
                'side_effects'          => $medicine->side_effects,
                'interactions'          => $medicine->interactions,
                'usage_duration'        => $medicine->usage_duration,
                'composition'           => $medicine->composition,
                'contraindications'     => $medicine->contraindications,
                'image_url'             => $medicine->image_url,
                'prescription_required' => $medicine->prescription_required,
                'created_at'            => $medicine->created_at,
                'updated_at'            => $medicine->updated_at,
            ],
        ]);
    }

    /**
     * GET /api/medicines/categories
     * List semua kategori unik (untuk filter di frontend).
     */
    public function categories()
    {
        $categories = Medicine::select('category')
            ->distinct()
            ->orderBy('category')
            ->pluck('category');

        return response()->json([
            'status'  => 'success',
            'message' => 'Kategori berhasil diambil',
            'data'    => $categories,
        ]);
    }
}
