<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use Illuminate\Http\Request;

class PrescriptionController extends Controller
{
    public function index(Request $request)
    {
        $query = Prescription::with(['user', 'order']);

        if ($request->user()->role === 'member') {
            $query->where('user_id', $request->user()->id);
        }

        $prescriptions = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $prescriptions
        ]);
    }

    public function show(Request $request, $id)
    {
        $prescription = Prescription::with(['user', 'order'])->findOrFail($id);

        if ($prescription->user_id !== $request->user()->id && $request->user()->role === 'member') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $prescription
        ]);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'image' => 'required|image|mimes:jpeg,png,jpg|max:10240',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Prescription validation failed', [
                'errors' => $e->errors()
            ]);
            throw $e;
        }

        $path = $request->file('image')->store('prescriptions', 'public');

        $prescription = Prescription::create([
            'user_id' => $request->user()->id,
            'image_url' => $path,
            'status' => 'pending'
        ]);

        // Send database notification to the user
        try {
            $request->user()->notify(new \App\Notifications\AppNotification(
                'Upload Resep Berhasil',
                'Resep Anda berhasil diunggah dan sedang menunggu validasi dari Apoteker.',
                'prescription'
            ));
        } catch (\Exception $e) {
            \Log::error('Failed to send upload notification: ' . $e->getMessage());
        }

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
            'notes' => 'required|string',
            'total_price' => 'required_if:status,valid|nullable|numeric|min:0'
        ]);

        $prescription = Prescription::findOrFail($id);
        $prescription->update([
            'status' => $request->status,
            'notes' => $request->notes,
            'total_price' => $request->status === 'valid' ? $request->total_price : null
        ]);

        // Send status update notification to the user
        try {
            $user = $prescription->user;
            if ($user) {
                $statusLabel = $request->status === 'valid' ? 'Diterima & Valid' : 'Ditolak';
                $notifType = $request->status === 'valid' ? 'success' : 'error';
                $notesText = $request->notes ? " (Catatan: {$request->notes})" : "";

                $user->notify(new \App\Notifications\AppNotification(
                    "Status Resep Diperbarui",
                    "Resep Anda telah dinyatakan {$statusLabel} oleh Apoteker{$notesText}.",
                    $notifType
                ));
            }
        } catch (\Exception $e) {
            \Log::error('Failed to send prescription status notification: ' . $e->getMessage());
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Status resep berhasil diperbarui',
            'data' => $prescription
        ]);
    }
}
