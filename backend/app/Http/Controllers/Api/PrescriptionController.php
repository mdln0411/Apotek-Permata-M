<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function index(Request $request)
    {
        // Pharmacist can see all pending/valid prescriptions
        $prescriptions = Prescription::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $prescriptions
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $path = $request->file('image')->store('prescriptions', 'public');

        $prescription = Prescription::create([
            'user_id' => $request->user()->id,
            'image_url' => $path,
            'status' => 'pending'
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Resep berhasil diunggah',
            'data' => $prescription
        ], 201);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,valid,rejected',
            'notes' => 'nullable|string'
        ]);

        $prescription = Prescription::findOrFail($id);
        $prescription->update([
            'status' => $request->status,
            'notes' => $request->notes
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status resep berhasil diperbarui',
            'data' => $prescription
        ]);
    }
}
