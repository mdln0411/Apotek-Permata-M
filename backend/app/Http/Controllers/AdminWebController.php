<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Order;
use App\Models\Medicine;
use App\Models\Education;
use Illuminate\Support\Facades\DB;


class AdminWebController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'totalUsers' => User::count(),
            'totalRevenue' => Order::whereIn('status', ['selesai', 'completed'])->sum('total_price'),
            'totalMedicines' => Medicine::count(),
            'pendingOrders' => Order::whereIn('status', ['menunggu', 'pending'])->count(),
        ];

        $recentUsers = User::latest()->take(5)->get();
        $recentOrders = Order::with('user')->latest()->take(5)->get();

        return view('admin.dashboard', compact('stats', 'recentUsers', 'recentOrders'));
    }

    public function users()
    {
        $users = User::where('role', '!=', 'admin')->latest()->get();
        return view('admin.users', compact('users'));
    }

    public function updateUserRole(Request $request, User $user)
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'Role admin tidak dapat diubah.');
        }

        $request->validate([
            'role' => 'required|in:apoteker,member'
        ]);

        $user->update(['role' => $request->role]);
        return back()->with('success', 'Role user berhasil diperbarui.');
    }

    public function destroyUser(User $user)
    {
        if ($user->role === 'admin') {
            return back()->with('error', 'Akun admin tidak dapat dihapus.');
        }

        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak bisa menghapus akun anda sendiri.');
        }
        $user->delete();
        return back()->with('success', 'User berhasil dihapus.');
    }

    public function reports()
    {
        $totalRevenue = Order::whereIn('status', ['selesai', 'completed'])->sum('total_price');
        $totalOrders = Order::whereIn('status', ['selesai', 'completed'])->count();
        
        // Monthly Growth
        $monthlyRevenue = Order::whereIn('status', ['selesai', 'completed'])
            ->select(
                DB::raw('SUM(total_price) as total'),
                DB::raw("DATE_FORMAT(created_at, '%M %Y') as month")
            )
            ->groupBy('month')
            ->orderBy('created_at', 'desc')
            ->take(12)
            ->get();

        // Staff Performance (Orders Processed)
        // Note: Assuming there's a processed_by or similar field, or just count orders by status
        // For now, let's just show top categories
        $topCategories = Medicine::select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->orderBy('count', 'desc')
            ->get();

        return view('admin.reports', compact('totalRevenue', 'totalOrders', 'monthlyRevenue', 'topCategories'));
    }

    // Education Management
    public function education()
    {
        $educations = Education::latest()->get();
        return view('admin.education', compact('educations'));
    }

    public function storeEducation(Request $request)
    {
        $data = $request->validate([
            'title' => 'required',
            'content' => 'required',
            'category' => 'required',
            'author' => 'nullable',
            'image_url' => 'nullable|url'
        ]);

        Education::create($data);
        return back()->with('success', 'Edukasi berhasil diterbitkan.');
    }

    public function updateEducation(Request $request, Education $education)
    {
        $data = $request->validate([
            'title' => 'required',
            'content' => 'required',
            'category' => 'required',
            'author' => 'nullable',
            'image_url' => 'nullable|url'
        ]);

        $education->update($data);
        return back()->with('success', 'Edukasi berhasil diperbarui.');
    }

    public function destroyEducation(Education $education)
    {
        $education->delete();
        return back()->with('success', 'Edukasi berhasil dihapus.');
    }

    // Medicine Management (Admin view)
    public function medicines(Request $request)
    {
        $query = Medicine::query();
        if ($request->has('q') && $request->q != '') {
            $query->where(function($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->q . '%')
                  ->orWhere('category', 'LIKE', '%' . $request->q . '%');
            });
        }
        $medicines = $query->latest()->get();
        return view('admin.medicines', compact('medicines'));
    }


    // Transaction Management (Admin view)
    public function transactions(Request $request)
    {
        $query = Order::with('user');
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }
        $orders = $query->latest()->get();
        return view('admin.transactions', compact('orders'));
    }
}


