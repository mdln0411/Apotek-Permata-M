<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => 'member', // Default register as member
            'phone' => $request->phone,
            'address' => $request->address,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'User registered successfully',
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid login details'
            ], 401);
        }

        $user = User::where('email', $request['email'])->firstOrFail();

        if ($user->is_active === false) {
            Auth::logout();
            return response()->json([
                'status' => 'error',
                'message' => 'Akun Anda dinonaktifkan. Hubungi admin.',
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => 'Login successful',
            'data' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Logged out successfully'
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user()
        ]);
    }

    public function allUsers(Request $request)
    {
        // Pastikan hanya admin yang bisa akses
        if ($request->user()->role !== 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => User::where('role', '!=', 'admin')->orderBy('created_at', 'desc')->get()
        ]);
    }

    public function storeUser(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|string|in:member,apoteker',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
        ]);

        return response()->json(['status' => 'success', 'message' => 'User berhasil ditambahkan', 'data' => $user], 201);
    }

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($user->role === 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Data admin tidak dapat diubah'], 403);
        }
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|unique:users,email,'.$id,
            'password' => 'sometimes|nullable|string|min:8',
            'role' => 'sometimes|required|string|in:member,apoteker',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);
        return response()->json(['status' => 'success', 'message' => 'Data user berhasil diperbarui', 'data' => $user]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string',
            'address' => 'nullable|string',
            'profile_photo' => 'nullable|image|max:10240',
        ]);

        $data = [
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
        ];

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $data['profile_photo'] = $path;
        }

        $user->update($data);

        return response()->json([
            'status' => 'success',
            'message' => 'Profil berhasil diperbarui',
            'data' => $user
        ]);
    }

    public function destroyUser($id)
    {
        $user = User::findOrFail($id);
        if ($user->role === 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Tidak dapat menghapus sesama Admin'], 403);
        }
        $user->delete();
        return response()->json(['status' => 'success', 'message' => 'User berhasil dihapus']);
    }

    public function changePassword(Request $request)
    {
        try {
            $request->validate([
                'old_password' => 'required|string',
                'new_password' => 'required|string',
                'new_password_confirmation' => 'required|string',
            ]);

            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Sesi login tidak valid. Silakan login ulang.',
                ], 401);
            }

            $storedHash = $user->getRawOriginal('password');

            // 1. Kata sandi lama harus sesuai dengan akun saat ini
            if (!Hash::check($request->old_password, $storedHash)) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Kata sandi lama tidak sesuai',
                ], 400);
            }

            // 2. Kata sandi baru harus sama dengan konfirmasi
            if ($request->new_password !== $request->new_password_confirmation) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Konfirmasi kata sandi baru tidak cocok',
                ], 400);
            }

            // 3. Kata sandi baru minimal 8 karakter
            if (strlen($request->new_password) < 8) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Kata sandi baru harus minimal 8 karakter',
                ], 400);
            }

            $user->forceFill(['password' => $request->new_password]);
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Kata sandi berhasil diperbarui',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            throw $e;
        } catch (\Throwable $e) {
            report($e);
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan server saat memperbarui kata sandi',
            ], 500);
        }
    }
}
