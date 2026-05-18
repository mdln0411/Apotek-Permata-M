<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Medicine;
use App\Models\Prescription;
use App\Models\Message;
use App\Models\Consultation;
use App\Models\OrderItem;

use Illuminate\Support\Facades\DB;

class ApotekerWebController extends Controller
{
    public function dashboard()
    {
        $stats = [
            'pendingOrders' => Order::whereIn('status', ['menunggu', 'pending'])->count(),
            'reportedOrders' => Order::where('status', 'dilaporkan')->count(),
            'pendingPrescriptions' => Prescription::where('status', 'pending')->count(),
            'lowStock' => Medicine::where('stock', '<', 10)->count(),
            'totalRevenue' => Order::whereIn('status', ['selesai', 'completed'])->sum('total_price'),
        ];
        return view('apoteker.dashboard', compact('stats'));
    }



    public function orders(Request $request)
    {
        $query = Order::with(['user', 'items.medicine']);
        
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        $orders = $query->latest()->get();
        return view('apoteker.orders', compact('orders'));
    }

    public function exportOrders()
    {
        $orders = Order::with('user')->latest()->get();
        $filename = "laporan_pesanan_" . date('Y-m-d') . ".csv";
        $handle = fopen('php://output', 'w');
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');

        fputcsv($handle, ['ID Pesanan', 'Nomor Order', 'Pasien', 'Total Harga', 'Status', 'Tanggal']);

        foreach ($orders as $order) {
            fputcsv($handle, [
                $order->id,
                $order->order_number,
                $order->user->name,
                $order->total_price,
                $order->status,
                $order->created_at->format('Y-m-d H:i')
            ]);
        }

        fclose($handle);
        exit;
    }


    public function orderDetail(Order $order)
    {
        $order->load(['user', 'items.medicine']);
        return response()->json($order);
    }


    public function updateOrderStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:menunggu,diproses,dikirim,selesai,dibatalkan'
        ]);

        $order->update(['status' => $request->status]);
        return back()->with('success', 'Status pesanan berhasil diperbarui.');
    }

    public function medicines(Request $request)
    {
        $query = Medicine::query();

        if ($request->has('q') && $request->q != '') {
            $query->where('name', 'LIKE', '%' . $request->q . '%')
                  ->orWhere('category', 'LIKE', '%' . $request->q . '%');
        }

        if ($request->has('filter') && $request->filter == 'low_stock') {
            $query->where('stock', '<', 10);
        }

        $medicines = $query->latest()->get();
        return view('apoteker.medicines', compact('medicines'));
    }


    public function storeMedicine(Request $request)
    {
        $data = $request->validate([
            'name' => 'required',
            'category' => 'required',
            'indication' => 'nullable',
            'unit' => 'nullable',
            'price' => 'required|numeric',
            'price_detail' => 'nullable',
            'stock' => 'required|integer',
            'usage_rules' => 'nullable',
            'dosage' => 'nullable',
            'side_effects' => 'nullable',
            'interactions' => 'nullable',
            'usage_duration' => 'nullable',
            'composition' => 'nullable',
            'contraindications' => 'nullable',
            'image_url' => 'nullable|url',
            'prescription_required' => 'nullable'
        ]);


        if (!$request->has('prescription_required')) {
            $data['prescription_required'] = false;
        }

        Medicine::create($data);
        return back()->with('success', 'Obat berhasil ditambahkan.');
    }

    public function updateMedicine(Request $request, Medicine $medicine)
    {
        $data = $request->validate([
            'name' => 'required',
            'category' => 'required',
            'indication' => 'nullable',
            'unit' => 'nullable',
            'price' => 'required|numeric',
            'price_detail' => 'nullable',
            'stock' => 'required|integer',
            'usage_rules' => 'nullable',
            'dosage' => 'nullable',
            'side_effects' => 'nullable',
            'interactions' => 'nullable',
            'usage_duration' => 'nullable',
            'composition' => 'nullable',
            'contraindications' => 'nullable',
            'image_url' => 'nullable|url',
            'prescription_required' => 'nullable'
        ]);


        $data['prescription_required'] = $request->has('prescription_required');

        $medicine->update($data);
        return back()->with('success', 'Data obat berhasil diperbarui.');
    }


    public function destroyMedicine(Medicine $medicine)
    {
        $medicine->delete();
        return back()->with('success', 'Obat berhasil dihapus.');
    }


    public function prescriptions(Request $request)
    {
        $query = Prescription::with('user');
        
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }
        
        $prescriptions = $query->latest()->get();
        return view('apoteker.prescriptions', compact('prescriptions'));
    }

    public function exportPrescriptions(Request $request)
    {
        $query = Prescription::with('user');
        
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }
        
        $prescriptions = $query->latest()->get();
        $filename = "laporan_resep_" . date('Y-m-d') . ".csv";
        $handle = fopen('php://output', 'w');
        
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $filename . '"');

        fputcsv($handle, ['ID Resep', 'Pasien', 'Email Pasien', 'Status', 'Catatan', 'Tanggal Diunggah']);

        foreach ($prescriptions as $p) {
            fputcsv($handle, [
                $p->id,
                $p->user ? $p->user->name : 'Guest',
                $p->user ? $p->user->email : '-',
                $p->status,
                $p->notes ?? '-',
                $p->created_at->format('Y-m-d H:i')
            ]);
        }

        fclose($handle);
        exit;
    }

    public function updatePrescriptionStatus(Request $request, Prescription $prescription)
    {
        $request->validate([
            'status' => 'required|in:pending,valid,rejected'
        ]);

        $prescription->update([
            'status' => $request->status,
            'notes' => $request->notes
        ]);
        return back()->with('success', 'Status resep berhasil diperbarui.');
    }


    public function chat()
    {
        $consultations = Consultation::with(['user', 'messages' => function($q) {
            $q->latest()->limit(1);
        }])->get();
        return view('apoteker.chat', compact('consultations'));
    }

    public function getMessages(Consultation $consultation)
    {
        $messages = $consultation->messages()->with('user')->oldest()->get();
        return response()->json($messages);
    }

    public function sendMessage(Request $request, Consultation $consultation)
    {
        $request->validate(['message' => 'required']);
        
        $message = Message::create([
            'consultation_id' => $consultation->id,
            'sender_id' => auth()->id(),
            'message' => $request->message,
            'is_read' => false
        ]);

        return response()->json($message);
    }

    public function reports()
    {
        $totalRevenue = Order::whereIn('status', ['selesai', 'completed'])->sum('total_price');
        $totalOrders = Order::whereIn('status', ['selesai', 'completed'])->count();
        
        // Monthly Revenue (Last 6 months)
        $monthlyRevenue = Order::whereIn('status', ['selesai', 'completed'])
            ->select(
                DB::raw('SUM(total_price) as total'),
                DB::raw("DATE_FORMAT(created_at, '%M %Y') as month")
            )
            ->groupBy('month')
            ->orderBy('created_at', 'desc')
            ->take(6)
            ->get();

        // Top Selling Medicines
        $topMedicines = OrderItem::select('medicine_id', DB::raw('SUM(quantity) as total_sold'))
            ->with('medicine')
            ->groupBy('medicine_id')
            ->orderBy('total_sold', 'desc')
            ->take(5)
            ->get();

        return view('apoteker.reports', compact('totalRevenue', 'totalOrders', 'monthlyRevenue', 'topMedicines'));
    }



}
