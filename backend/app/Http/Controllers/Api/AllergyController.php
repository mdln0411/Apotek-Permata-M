<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Allergy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AllergyController extends Controller
{
    /**
     * Get all allergies for the authenticated user.
     */
    public function index()
    {
        $allergies = Auth::user()->allergies()->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $allergies
        ]);
    }

    /**
     * Store a new allergy for the authenticated user.
     */
    public function store(Request $request)
    {
        $request->validate([
            'allergen_name' => 'required|string|max:255',
            'symptom' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'severity' => 'required|in:sedang,berat',
        ]);

        $allergy = Auth::user()->allergies()->create([
            'allergen_name' => $request->allergen_name,
            'symptom' => $request->symptom,
            'description' => $request->description,
            'severity' => $request->severity,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Alergi berhasil ditambahkan.',
            'data' => $allergy
        ], 201);
    }

    /**
     * Delete an allergy.
     */
    public function destroy($id)
    {
        $allergy = Auth::user()->allergies()->findOrFail($id);
        $allergy->delete();

        return response()->json([
            'success' => true,
            'message' => 'Alergi berhasil dihapus.'
        ]);
    }
}
