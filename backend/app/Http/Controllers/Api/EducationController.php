<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EducationController extends Controller
{
    public function index()
    {
        $data = Education::orderBy('created_at', 'desc')->get();
        return response()->json([
            'status' => 'success',
            'data' => $data
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'category' => 'required|string',
            'author' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_url' => 'nullable|string'
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('educations', 'public');
            $validated['image_url'] = $path;
        }
        unset($validated['image']);

        $education = Education::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Edukasi berhasil ditambahkan',
            'data' => $education
        ], 201);
    }

    public function show($id)
    {
        $education = Education::find($id);
        if (!$education) {
            return response()->json(['status' => 'error', 'message' => 'Data tidak ditemukan'], 404);
        }
        return response()->json(['status' => 'success', 'data' => $education]);
    }

    public function update(Request $request, $id)
    {
        $education = Education::findOrFail($id);
        
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'content' => 'sometimes|required|string',
            'category' => 'sometimes|required|string',
            'author' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'image_url' => 'nullable|string'
        ]);

        if ($request->hasFile('image')) {
            if ($education->image_url && !str_starts_with($education->image_url, 'http')) {
                Storage::disk('public')->delete($education->image_url);
            }
            $path = $request->file('image')->store('educations', 'public');
            $validated['image_url'] = $path;
        }
        unset($validated['image']);

        $education->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Edukasi berhasil diperbarui',
            'data' => $education
        ]);
    }

    public function destroy($id)
    {
        $education = Education::findOrFail($id);
        if ($education->image_url && !str_starts_with($education->image_url, 'http')) {
            Storage::disk('public')->delete($education->image_url);
        }
        $education->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Edukasi berhasil dihapus'
        ]);
    }
}
