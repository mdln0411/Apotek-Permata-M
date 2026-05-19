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

        // --- SEARCH pintar berdasarkan kata kunci ---
        if ($request->filled('search')) {
            $search = trim($request->search);
            $words = preg_split('/\s+/', strtolower($search));
            
            // Kata-kata umum (stopwords) yang diabaikan agar pencarian lebih akurat dan tidak meluas
            $stopwords = ['obat', 'dan', 'yang', 'untuk', 'dari', 'pada', 'dengan', 'ke', 'di', 'ini', 'itu', 'atau', 'ada', 'bisa', 'saya', 'dapat', 'mengatasi', 'meredakan', 'sakit'];
            $filteredWords = array_filter($words, function($word) use ($stopwords) {
                return strlen($word) >= 2 && !in_array($word, $stopwords);
            });

            if (empty($filteredWords)) {
                $filteredWords = $words;
            }

            $query->where(function($q) use ($filteredWords) {
                foreach ($filteredWords as $word) {
                    $q->where(function($subQ) use ($word) {
                        $subQ->orWhere('name', 'like', '%' . $word . '%')
                             ->orWhere('category', 'like', '%' . $word . '%')
                             ->orWhere('indication', 'like', '%' . $word . '%')
                             ->orWhere('composition', 'like', '%' . $word . '%')
                             ->orWhere('interactions', 'like', '%' . $word . '%');
                    });
                }
            });
        }

        // --- FILTER berdasarkan kategori ---
        if ($request->filled('category')) {
            $category = $request->category;
            if ($category === 'Lain-lain') {
                $knownCategories = ['Batuk', 'Flu', 'Pilek', 'Demam', 'Lambung', 'P3K', 'Vitamin', 'Lansia', 'Bayi', 'Susu', 'Kecantikan', 'Hamil & Menyusui', 'Pereda Nyeri', 'Antibiotik'];
                $query->where(function($q) use ($knownCategories) {
                    foreach ($knownCategories as $known) {
                        $q->where('category', 'not like', '%' . $known . '%');
                    }
                });
            } else {
                $query->where('category', 'like', '%' . $category . '%');
            }
        }

        // --- SORT & ALPHABET RANGE ---
        if ($request->filled('sort_by')) {
            $sortBy = $request->sort_by;
            if ($sortBy === 'A-Z') {
                $query->orderBy('name', 'asc');
            } elseif ($sortBy === 'Z-A') {
                $query->orderBy('name', 'desc');
            } elseif ($sortBy === 'A-G') {
                $query->where(function($q) {
                    for ($i = ord('A'); $i <= ord('G'); $i++) {
                        $char = chr($i);
                        $q->orWhere('name', 'like', $char . '%');
                    }
                })->orderBy('name', 'asc');
            } elseif ($sortBy === 'G-Z') {
                $query->where(function($q) {
                    for ($i = ord('G'); $i <= ord('Z'); $i++) {
                        $char = chr($i);
                        $q->orWhere('name', 'like', $char . '%');
                    }
                })->orderBy('name', 'asc');
            }
        } else {
            $query->orderBy('name', 'asc');
        }

        // --- FILTER perlu resep atau tidak ---
        if ($request->has('prescription_required')) {
            $query->where('prescription_required', filter_var($request->prescription_required, FILTER_VALIDATE_BOOLEAN));
        }

        // --- PAGINATION (default 10 per halaman) ---
        $perPage = $request->input('per_page', 10);
        $medicines = $query->paginate($perPage);

        // --- Format response ringkas untuk halaman katalog ---
        return response()->json([
            'status' => 'success',
            'message' => 'Data obat berhasil diambil',
            'data' => $medicines->getCollection()->map(function ($medicine) {
                return [
                    'id' => $medicine->id,
                    'name' => $medicine->name,
                    'category' => $medicine->category,
                    'unit' => $medicine->unit,
                    'price' => $medicine->price,
                    'price_formatted' => 'Rp ' . number_format($medicine->price, 0, ',', '.'),
                    'stock' => $medicine->stock,
                    'image_url' => $medicine->image_url,
                    'prescription_required' => $medicine->prescription_required,
                ];
            }),
            'pagination' => [
                'current_page' => $medicines->currentPage(),
                'last_page' => $medicines->lastPage(),
                'per_page' => $medicines->perPage(),
                'total' => $medicines->total(),
                'has_more' => $medicines->hasMorePages(),
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
                'status' => 'error',
                'message' => 'Obat tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Detail obat berhasil diambil',
            'data' => [
                'id' => $medicine->id,
                'name' => $medicine->name,
                'category' => $medicine->category,
                'indication' => $medicine->indication,
                'unit' => $medicine->unit,
                'price' => $medicine->price,
                'price_formatted' => 'Rp ' . number_format($medicine->price, 0, ',', '.'),
                'price_detail' => $medicine->price_detail,
                'stock' => $medicine->stock,
                'usage_rules' => $medicine->usage_rules,
                'dosage' => $medicine->dosage,
                'side_effects' => $medicine->side_effects,
                'interactions' => $medicine->interactions,
                'usage_duration' => $medicine->usage_duration,
                'composition' => $medicine->composition,
                'contraindications' => $medicine->contraindications,
                'image_url' => $medicine->image_url,
                'prescription_required' => $medicine->prescription_required,
                'created_at' => $medicine->created_at,
                'updated_at' => $medicine->updated_at,
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
            'status' => 'success',
            'message' => 'Kategori berhasil diambil',
            'data' => $categories,
        ]);
    }

    /**
     * POST /api/medicines
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'unit' => 'nullable|string',
            'prescription_required' => 'boolean',
            'indication' => 'nullable|string',
            'usage_rules' => 'nullable|string',
            'dosage' => 'nullable|string',
            'composition' => 'nullable|string',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Max 2MB
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('medicines', 'public');
            $validated['image_url'] = $path;
        }

        $medicine = Medicine::create($validated);

        return response()->json(['status' => 'success', 'message' => 'Obat berhasil ditambahkan', 'data' => $medicine], 201);
    }

    /**
     * PUT /api/medicines/{id}
     */
    public function update(Request $request, $id)
    {
        $medicine = Medicine::findOrFail($id);
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'category' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'unit' => 'nullable|string',
            'prescription_required' => 'boolean',
            'indication' => 'nullable|string',
            'usage_rules' => 'nullable|string',
            'dosage' => 'nullable|string',
            'composition' => 'nullable|string',
            'image_url' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada dan bukan URL eksternal
            if ($medicine->image_url && !str_starts_with($medicine->image_url, 'http')) {
                \Storage::disk('public')->delete($medicine->image_url);
            }
            $path = $request->file('image')->store('medicines', 'public');
            $validated['image_url'] = $path;
        }

        $medicine->update($validated);
        return response()->json(['status' => 'success', 'message' => 'Obat berhasil diperbarui', 'data' => $medicine]);
    }

    /**
     * DELETE /api/medicines/{id}
     */
    public function destroy($id)
    {
        Medicine::findOrFail($id)->delete();
        return response()->json(['status' => 'success', 'message' => 'Obat berhasil dihapus']);
    }
}
