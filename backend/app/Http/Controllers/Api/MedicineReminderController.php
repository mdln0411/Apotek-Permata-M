<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MedicineReminder;
use Illuminate\Http\Request;

class MedicineReminderController extends Controller
{
    public function index(Request $request)
    {
        $reminders = MedicineReminder::where('user_id', $request->user()->id)
            ->orderBy('reminder_time', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $reminders
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'medicine_name' => 'required|string',
            'reminder_time' => 'required',
            'dosage' => 'nullable|string',
            'days' => 'nullable|array',
        ]);

        $reminder = MedicineReminder::create([
            'user_id' => $request->user()->id,
            'medicine_name' => $request->medicine_name,
            'reminder_time' => $request->reminder_time,
            'dosage' => $request->dosage,
            'days' => $request->days,
            'is_active' => true,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Reminder created successfully',
            'data' => $reminder
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $reminder = MedicineReminder::where('user_id', $request->user()->id)->findOrFail($id);
        
        $reminder->update($request->only([
            'medicine_name', 'reminder_time', 'dosage', 'days', 'is_active'
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Reminder updated successfully',
            'data' => $reminder
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $reminder = MedicineReminder::where('user_id', $request->user()->id)->findOrFail($id);
        $reminder->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Reminder deleted successfully'
        ]);
    }
}
