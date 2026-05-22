<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PasswordResetController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);
        $otp = rand(100000, 999999);
        
        \Cache::put('otp_' . $request->email, $otp, now()->addMinutes(10));
        
        // Use Mail facade to log the OTP
        \Mail::raw("Kode OTP Anda adalah: $otp\nBerlaku selama 10 menit.", function ($message) use ($request) {
            $message->to($request->email)->subject('Kode OTP Reset Password');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'OTP telah dikirim ke email Anda.'
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|numeric'
        ]);

        $cachedOtp = \Cache::get('otp_' . $request->email);

        if (!$cachedOtp || $cachedOtp != $request->otp) {
            return response()->json(['status' => 'error', 'message' => 'OTP tidak valid atau sudah kadaluarsa.'], 400);
        }

        // Generate a reset token
        $resetToken = \Str::random(60);
        \Cache::put('reset_token_' . $request->email, $resetToken, now()->addMinutes(15));
        
        // Remove OTP
        \Cache::forget('otp_' . $request->email);

        return response()->json([
            'status' => 'success',
            'message' => 'OTP valid.',
            'reset_token' => $resetToken
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'reset_token' => 'required|string',
            'password' => 'required|string|min:6'
        ]);

        $cachedToken = \Cache::get('reset_token_' . $request->email);

        if (!$cachedToken || $cachedToken !== $request->reset_token) {
            return response()->json(['status' => 'error', 'message' => 'Sesi reset password tidak valid atau kadaluarsa.'], 400);
        }

        $user = \App\Models\User::where('email', $request->email)->first();
        $user->password = \Hash::make($request->password);
        $user->save();

        \Cache::forget('reset_token_' . $request->email);

        return response()->json([
            'status' => 'success',
            'message' => 'Password berhasil diubah. Silakan login dengan password baru.'
        ]);
    }
}
