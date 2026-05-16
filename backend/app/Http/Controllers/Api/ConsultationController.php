<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Consultation;
use App\Models\Message;
use Illuminate\Http\Request;

class ConsultationController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'apoteker' || $user->role === 'admin') {
            $consultations = Consultation::with(['user', 'messages' => function($q) {
                $q->latest()->limit(1);
            }])->orderBy('updated_at', 'desc')->get();
        } else {
            $consultations = Consultation::where('user_id', $user->id)
                ->with(['pharmacist', 'messages' => function($q) {
                    $q->latest()->limit(1);
                }])->orderBy('updated_at', 'desc')->get();
        }

        return response()->json([
            'status' => 'success',
            'data' => $consultations
        ]);
    }

    public function store(Request $request)
    {
        $consultation = Consultation::create([
            'user_id' => $request->user()->id,
            'status' => 'active'
        ]);

        return response()->json([
            'status' => 'success',
            'data' => $consultation
        ], 201);
    }

    public function show($id)
    {
        $consultation = Consultation::with(['user', 'pharmacist', 'messages.sender'])->findOrFail($id);
        return response()->json([
            'status' => 'success',
            'data' => $consultation
        ]);
    }

    public function sendMessage(Request $request, $id)
    {
        $request->validate([
            'message' => 'required|string'
        ]);

        $consultation = Consultation::findOrFail($id);
        
        // If pharmacist replies, assign them to this consultation
        if ($request->user()->role === 'apoteker' && !$consultation->pharmacist_id) {
            $consultation->update(['pharmacist_id' => $request->user()->id]);
        }

        $message = Message::create([
            'consultation_id' => $id,
            'sender_id' => $request->user()->id,
            'message' => $request->message
        ]);

        $consultation->touch(); // Update updated_at

        return response()->json([
            'status' => 'success',
            'data' => $message->load('sender')
        ], 201);
    }
}
