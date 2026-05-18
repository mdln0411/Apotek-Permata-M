<?php

namespace App\Http\Controllers;

use App\Models\MedicineReminder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MedicineReminderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reminders = MedicineReminder::where('user_id', Auth::id())
            ->orderBy('reminder_time', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $reminders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'medicine_name' => 'required|string|max:255',
            'reminder_time' => 'required|string', // Format HH:MM
            'dosage' => 'nullable|string',
            'days' => 'nullable|array',
        ]);

        $reminder = MedicineReminder::create([
            'user_id' => Auth::id(),
            'medicine_name' => $request->medicine_name,
            'reminder_time' => $request->reminder_time,
            'dosage' => $request->dosage,
            'days' => $request->days ?? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
            'is_active' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pengingat berhasil ditambahkan',
            'data' => $reminder
        ], 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $reminder = MedicineReminder::where('user_id', Auth::id())->findOrFail($id);

        $request->validate([
            'medicine_name' => 'sometimes|string|max:255',
            'reminder_time' => 'sometimes|string',
            'is_active' => 'sometimes|boolean',
            'days' => 'sometimes|array',
            'dosage' => 'sometimes|nullable|string',
        ]);

        $reminder->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Pengingat berhasil diperbarui',
            'data' => $reminder
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $reminder = MedicineReminder::where('user_id', Auth::id())->findOrFail($id);
        $reminder->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Pengingat berhasil dihapus'
        ]);
    }
}
