<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Medicine;
use App\Services\MedicineUnitService;
use Illuminate\Http\Request;

class MedicineController extends Controller
{
    /**
     * Peta filter katalog → pola kategori di database.
     * Luka & antiseptik digabung ke P3K.
     */
    private function categoryFilterMap(): array
    {
        return [
            'Batuk' => ['Batuk Dan Pilek', 'Batuk Dan Flu', 'Batuk'],
            'Flu' => ['Batuk Dan Flu', 'Alergi & Flu', 'Flu'],
            'Pilek' => ['Batuk Dan Pilek', 'Pilek'],
            'Demam' => ['Demam'],
            'Lambung' => ['Asam Lambung', 'Lambung'],
            'P3K' => ['Cedera Ringan', 'Luka Bakar', 'Luka', 'antiseptik', 'desinfektan'],
            'Vitamin & Suplemen' => ['Multivitamin', 'Suplemen', 'Vitamin'],
            'Alergi' => ['Alergi'],
            'Diare' => ['Diare'],
            'Pereda Nyeri' => ['Nyeri'],
            'Antibiotik' => ['obat antibiotika', 'Infeksi Bakteri'],
            'Bayi' => ['MPASI', 'Popok bayi', 'Popok celana', 'Dot bayi', 'Biskuit bayi', 'Bubur bayi', 'Minyak bayi', 'Krim bayi', 'Set makan bayi', 'Snack finger food', 'Botol susu bayi'],
            'Susu' => ['Susu'],
            'Kecantikan' => ['Kecantikan', 'Facial', 'Acne', 'Face Cream', 'Face Wash', 'Foaming', 'Gentle facial', 'Obat Jerawat', 'Moistur'],
            'Hamil & Menyusui' => ['hamil', 'menyusui', 'Kehamilan', 'kontrasepsi', 'pil KB'],
            'Lansia' => ['lansia', 'dewasa perekat'],
            'Diabetes' => ['Diabetes'],
            'Hipertensi' => ['Hipertensi'],
            'Asma' => ['Asma'],
        ];
    }

    private function escapeLike(string $value): string
    {
        return str_replace(['\\', '%', '_'], ['\\\\', '\\%', '\\_'], $value);
    }

    private function applyCategoryFilter($query, string $category): void
    {
        $map = $this->categoryFilterMap();

        if ($category === 'Lain-lain') {
            $allPatterns = array_unique(array_merge(...array_values($map)));
            $query->where(function ($q) use ($allPatterns) {
                foreach ($allPatterns as $pattern) {
                    $q->where('category', 'not like', '%' . $pattern . '%');
                }
            });
            return;
        }

        if (!isset($map[$category])) {
            $query->where('category', 'like', '%' . $category . '%');
            return;
        }

        $patterns = $map[$category];
        $query->where(function ($q) use ($patterns) {
            foreach ($patterns as $pattern) {
                $q->orWhere('category', 'like', '%' . $pattern . '%');
            }
        });
    }

    private function applySearchFilter($query, string $search): string
    {
        $searchLower = strtolower($search);
        $words = preg_split('/\s+/', $searchLower);

        $stopwords = ['obat', 'dan', 'yang', 'untuk', 'dari', 'pada', 'dengan', 'ke', 'di', 'ini', 'itu', 'atau', 'ada', 'bisa', 'saya', 'dapat', 'mengatasi', 'meredakan'];
        $filteredWords = array_values(array_filter($words, function ($word) use ($stopwords) {
            return strlen($word) >= 2 && !in_array($word, $stopwords);
        }));

        if (empty($filteredWords)) {
            $filteredWords = array_values(array_filter($words, fn ($word) => strlen($word) >= 1));
        }

        $terms = array_values(array_unique(array_merge([$searchLower], $filteredWords)));

        $query->where(function ($q) use ($terms) {
            foreach ($terms as $index => $term) {
                $groupMethod = $index === 0 ? 'where' : 'orWhere';
                $q->{$groupMethod}(function ($subQ) use ($term) {
                    $subQ->where('name', 'like', '%' . $term . '%')
                        ->orWhere('category', 'like', '%' . $term . '%')
                        ->orWhere('indication', 'like', '%' . $term . '%')
                        ->orWhere('composition', 'like', '%' . $term . '%');
                });
            }
        });

        return $searchLower;
    }

    /**
     * Urutkan hasil pencarian: nama diawali kata kunci → kata dalam nama → kategori → isi lain.
     */
    private function applySearchRelevanceOrder($query, string $searchLower): void
    {
        $escaped = $this->escapeLike($searchLower);
        $prefix = $escaped . '%';
        $wordStart = '% ' . $escaped . '%';
        $contains = '%' . $escaped . '%';

        $query->orderByRaw("
            CASE
                WHEN LOWER(name) LIKE ? ESCAPE '\\\\' THEN 1000
                WHEN LOWER(name) LIKE ? ESCAPE '\\\\' THEN 800
                WHEN LOWER(category) LIKE ? ESCAPE '\\\\' THEN 600
                WHEN LOWER(name) LIKE ? ESCAPE '\\\\' THEN 400
                WHEN LOWER(category) LIKE ? ESCAPE '\\\\' THEN 200
                WHEN LOWER(COALESCE(indication, '')) LIKE ? ESCAPE '\\\\' THEN 100
                WHEN LOWER(COALESCE(composition, '')) LIKE ? ESCAPE '\\\\' THEN 50
                ELSE 0
            END DESC
        ", [$prefix, $wordStart, $prefix, $contains, $contains, $contains, $contains]);

        $query->orderBy('name', 'asc');
    }

    /**
     * GET /api/medicines
     * List katalog obat (ringkas) dengan search, filter kategori, dan pagination.
     */
    public function index(Request $request)
    {
        $query = Medicine::query()->active()->where('category', '!=', 'Resep');
        $searchLower = null;

        if ($request->filled('search')) {
            $searchLower = $this->applySearchFilter($query, trim($request->search));
        }

        if ($request->filled('category')) {
            $this->applyCategoryFilter($query, $request->category);
        }

        if ($searchLower !== null) {
            $this->applySearchRelevanceOrder($query, $searchLower);
        } elseif ($request->filled('sort_by')) {
            $sortBy = $request->sort_by;
            if ($sortBy === 'A-Z') {
                $query->orderBy('name', 'asc');
            } elseif ($sortBy === 'Z-A') {
                $query->orderBy('name', 'desc');
            } elseif ($sortBy === 'price-asc' || $sortBy === 'A-G') {
                $query->orderBy('price', 'asc');
            } elseif ($sortBy === 'price-desc' || $sortBy === 'G-Z') {
                $query->orderBy('price', 'desc');
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
                return $this->formatMedicineListItem($medicine);
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
        $medicine = Medicine::active()->find($id);

        if (!$medicine) {
            return response()->json([
                'status' => 'error',
                'message' => 'Obat tidak ditemukan',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Detail obat berhasil diambil',
            'data' => array_merge($this->formatMedicineListItem($medicine), [
                'indication' => $medicine->indication,
                'price_detail' => $medicine->price_detail,
                'usage_rules' => $medicine->usage_rules,
                'dosage' => $medicine->dosage,
                'side_effects' => $medicine->side_effects,
                'interactions' => $medicine->interactions,
                'usage_duration' => $medicine->usage_duration,
                'composition' => $medicine->composition,
                'contraindications' => $medicine->contraindications,
                'created_at' => $medicine->created_at,
                'updated_at' => $medicine->updated_at,
            ]),
        ]);
    }

    /**
     * GET /api/medicines/units
     * Daftar satuan unik dari database (untuk picker tambah obat).
     */
    public function units()
    {
        $rawUnits = Medicine::query()
            ->active()
            ->whereNotNull('unit')
            ->where('unit', '!=', '')
            ->distinct()
            ->pluck('unit');

        return response()->json([
            'status' => 'success',
            'message' => 'Daftar satuan berhasil diambil',
            'data' => MedicineUnitService::collectDistinctUnits($rawUnits),
        ]);
    }

    private function formatMedicineListItem(Medicine $medicine): array
    {
        return [
            'id' => $medicine->id,
            'name' => MedicineUnitService::displayName($medicine->name, $medicine->unit),
            'category' => $medicine->category,
            'unit' => MedicineUnitService::displayUnit($medicine->unit),
            'price' => $medicine->price,
            'price_formatted' => 'Rp ' . number_format($medicine->price, 0, ',', '.'),
            'stock' => max(0, (int) $medicine->stock),
            'image_url' => $medicine->image_url,
            'prescription_required' => $medicine->prescription_required,
        ];
    }

    /**
     * GET /api/medicines/categories
     * List semua kategori unik (untuk filter di frontend).
     */
    public function categories()
    {
        $filterLabels = array_keys($this->categoryFilterMap());
        $filterLabels[] = 'Lain-lain';

        return response()->json([
            'status' => 'success',
            'message' => 'Kategori filter berhasil diambil',
            'data' => $filterLabels,
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
            'price' => 'required|integer|min:0',
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

        if (!empty($validated['unit'])) {
            $validated['unit'] = MedicineUnitService::displayUnit($validated['unit']);
        }

        $validated['is_active'] = true;

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
            'price' => 'sometimes|required|integer|min:0',
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

        if (!empty($validated['unit'])) {
            $validated['unit'] = MedicineUnitService::displayUnit($validated['unit']);
        }

        $medicine->update($validated);
        return response()->json(['status' => 'success', 'message' => 'Obat berhasil diperbarui', 'data' => $medicine]);
    }

    /**
     * DELETE /api/medicines/{id}
     * Soft delete — obat disembunyikan dari katalog semua role.
     */
    public function destroy($id)
    {
        $medicine = Medicine::findOrFail($id);

        if (!$medicine->is_active) {
            return response()->json([
                'status' => 'success',
                'message' => 'Obat sudah tidak ditampilkan di katalog',
            ]);
        }

        $medicine->update(['is_active' => false]);

        return response()->json([
            'status' => 'success',
            'message' => 'Obat berhasil dihapus dari katalog',
        ]);
    }

    /**
     * GET /api/simulasi-obat/list
     * Ambil list semua obat unik yang ada di tabel simulasi.
     */
    public function getSimulationMedicines()
    {
        try {
            $obat1 = \DB::table('simulasi_interaksi_obat')->distinct()->pluck('obat1')->toArray();
            $obat2 = \DB::table('simulasi_interaksi_obat')->distinct()->pluck('obat2')->toArray();
            
            $allObats = array_unique(array_merge($obat1, $obat2));
            sort($allObats);
            
            return response()->json([
                'status' => 'success',
                'data' => array_values($allObats)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * GET /api/simulasi-obat/check
     * Cek interaksi antara dua obat.
     */
    public function checkSimulationInteraction(Request $request)
    {
        $request->validate([
            'obat1' => 'required|string',
            'obat2' => 'required|string',
        ]);

        $obatA = trim($request->obat1);
        $obatB = trim($request->obat2);

        try {
            $interaction = \DB::table('simulasi_interaksi_obat')
                ->where(function($q) use ($obatA, $obatB) {
                    $q->where(function($sub) use ($obatA, $obatB) {
                        $sub->where('obat1', '=', $obatA)
                            ->where('obat2', '=', $obatB);
                    })->orWhere(function($sub) use ($obatA, $obatB) {
                        $sub->where('obat1', '=', $obatB)
                            ->where('obat2', '=', $obatA);
                    });
                })
                ->first();

            if ($interaction) {
                return response()->json([
                    'status' => 'success',
                    'found' => true,
                    'data' => [
                        'obat1' => $interaction->obat1,
                        'obat2' => $interaction->obat2,
                        'simulasi' => $interaction->simulasi,
                    ]
                ]);
            }

            // Jika tidak ada data di DB, asumsikan aman
            return response()->json([
                'status' => 'success',
                'found' => false,
                'data' => [
                    'obat1' => $obatA,
                    'obat2' => $obatB,
                    'simulasi' => 'Aman dikonsumsi bersamaan'
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}

