<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class WebAuthController extends Controller
{
    public function showLogin()
    {
        if (Auth::check()) {
            return $this->redirectBasedOnRole(Auth::user());
        }
        return view('auth.login');
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();
            
            $user = Auth::user();
            if ($user->role === 'member') {
                Auth::logout();
                return back()->withErrors([
                    'email' => 'Halaman ini khusus untuk Staff. Pelanggan silakan gunakan aplikasi mobile.',
                ]);
            }

            return $this->redirectBasedOnRole($user);
        }

        return back()->withErrors([
            'email' => 'Email atau password salah.',
        ])->onlyInput('email');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    protected function redirectBasedOnRole($user)
    {
        if ($user->role === 'admin') {
            return redirect('/admin/dashboard');
        }
        if ($user->role === 'apoteker') {
            return redirect('/apoteker/dashboard');
        }
        return redirect('/');
    }
}
