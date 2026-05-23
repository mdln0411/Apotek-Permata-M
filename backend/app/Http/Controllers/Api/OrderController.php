<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Notifications\AppNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items.medicine')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|string',
            'notes' => 'nullable|string',
            'item_ids' => 'nullable|array',
            'item_ids.*' => 'integer',
            'prescription_id' => 'nullable|integer|exists:prescriptions,id',
        ]);

        $user = $request->user();

        if ($request->filled('prescription_id')) {
            $prescription = \App\Models\Prescription::where('user_id', $user->id)->findOrFail($request->prescription_id);
            if ($prescription->status !== 'valid') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Resep ini belum divalidasi atau ditolak oleh apoteker.'
                ], 400);
            }

            // Check if an order already exists for this prescription
            $existingOrder = Order::where('prescription_id', $prescription->id)->first();
            if ($existingOrder) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pesanan untuk resep ini sudah pernah dibuat.',
                    'data' => $existingOrder
                ], 400);
            }

            return DB::transaction(function () use ($user, $prescription, $request) {
                // Ensure dummy medicine exists
                $dummyMedicine = \App\Models\Medicine::firstOrCreate(
                    ['name' => 'Resep Digital'],
                    [
                        'category' => 'Resep',
                        'price' => 0.0,
                        'stock' => 999999,
                        'unit' => 'Resep',
                        'indication' => 'Obat resep yang divalidasi oleh apoteker',
                        'prescription_required' => true,
                    ]
                );

                // Create Order
                $order = Order::create([
                    'user_id' => $user->id,
                    'prescription_id' => $prescription->id,
                    'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                    'status' => 'menunggu_pembayaran',
                    'payment_status' => 'pending',
                    'total_price' => $prescription->total_price,
                    'shipping_address' => $request->shipping_address,
                    'notes' => $request->notes,
                ]);

                // Create Order Item representing the prescription
                OrderItem::create([
                    'order_id' => $order->id,
                    'medicine_id' => $dummyMedicine->id,
                    'name' => 'Obat Resep Digital #' . $prescription->id,
                    'quantity' => 1,
                    'price' => $prescription->total_price,
                    'subtotal' => $prescription->total_price,
                ]);

                // Send Notification
                $user->notify(new AppNotification(
                    'Pesanan Resep Berhasil',
                    "Pesanan untuk resep Anda ({$order->order_number}) telah berhasil dibuat. Silakan selesaikan pembayaran.",
                    'order'
                ));

                return response()->json([
                    'status' => 'success',
                    'message' => 'Order placed successfully',
                    'data' => $order->load('items')
                ], 201);
            });
        }

        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cart is empty'
            ], 400);
        }

        $itemIds = $request->input('item_ids');
        $cartItemsQuery = $cart->items()->with('medicine');
        if (!empty($itemIds)) {
            $cartItemsQuery->whereIn('id', $itemIds);
        }
        $cartItems = $cartItemsQuery->get();

        if ($cartItems->count() === 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'No items selected for checkout'
            ], 400);
        }

        return DB::transaction(function () use ($user, $cart, $request, $cartItems, $itemIds) {
            $totalPrice = 0;

            // Hitung total harga
            foreach ($cartItems as $item) {
                $totalPrice += $item->price * $item->quantity;
            }

            // Buat Order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'status' => 'menunggu_pembayaran',
                'payment_status' => 'pending',
                'total_price' => $totalPrice,
                'shipping_address' => $request->shipping_address,
                'notes' => $request->notes,
            ]);

            // Pindahkan item dari cart ke order_items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'medicine_id' => $item->medicine_id,
                    'name' => $item->medicine->name,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'subtotal' => $item->price * $item->quantity,
                ]);

                // Kurangi stok obat
                $medicine = $item->medicine;
                if ($medicine && $medicine->stock >= $item->quantity) {
                    $medicine->decrement('stock', $item->quantity);
                }
            }

            // Kosongkan keranjang (hanya item yang dicheckout)
            if (!empty($itemIds)) {
                $cart->items()->whereIn('id', $itemIds)->delete();
            } else {
                $cart->items()->delete();
            }

            // Kirim Notifikasi
            $user->notify(new AppNotification(
                'Pesanan Berhasil',
                "Pesanan {$order->order_number} telah berhasil dibuat. Silakan tunggu konfirmasi selanjutnya.",
                'order'
            ));

            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully',
                'data' => $order->load('items.medicine')
            ], 201);
        });
    }

    public function show(Request $request, $id)
    {
        $order = Order::with(['items.medicine', 'user'])->findOrFail($id);


        if ($order->user_id !== $request->user()->id && $request->user()->role === 'member') {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        return response()->json([
            'status' => 'success',
            'data' => $order
        ]);
    }

    public function allOrders(Request $request)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'apoteker') {
            return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
        }

        $orders = Order::with(['user', 'items.medicine'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $userRole = $request->user()->role;
        if ($userRole !== 'admin' && $userRole !== 'apoteker') {
            return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
        }

        $request->validate([
            'status' => 'required|in:menunggu_pembayaran,menunggu_konfirmasi,perlu_diproses,sedang_diproses,dikirim,selesai,dibatalkan,dilaporkan'
        ]);

        $newStatus = $request->status;

        if ($userRole === 'apoteker' && in_array($newStatus, ['selesai', 'dibatalkan'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Apoteker tidak diperbolehkan menyelesaikan atau membatalkan pesanan.'
            ], 403);
        }

        $order = Order::findOrFail($id);
        $oldStatus = $order->status;
        if ($oldStatus === $newStatus) {
            return response()->json([
                'status' => 'success',
                'message' => 'Status pesanan sama dengan status sebelumnya',
                'data' => $order
            ]);
        }

        // Return stock if cancelled
        if ($newStatus === 'dibatalkan' && $oldStatus !== 'dibatalkan') {
            foreach ($order->items as $item) {
                $medicine = \App\Models\Medicine::find($item->medicine_id);
                if ($medicine) {
                    $medicine->increment('stock', $item->quantity);
                }
            }
        }

        $order->update(['status' => $newStatus]);

        // Send notifications based on status change
        $title = '';
        $message = '';
        if ($newStatus === 'perlu_diproses') {
            $title = 'Pembayaran Diverifikasi';
            $message = "Pembayaran pesanan Anda {$order->order_number} telah diverifikasi dan pesanan akan segera diproses.";
        } else if ($newStatus === 'sedang_diproses') {
            $title = 'Pesanan Diproses';
            $message = "Pesanan Anda {$order->order_number} sedang diproses oleh apoteker.";
        } else if ($newStatus === 'dikirim') {
            $title = 'Pesanan Dikirim';
            $message = "Pesanan Anda {$order->order_number} sedang dalam perjalanan ke alamat Anda.";
        } else if ($newStatus === 'selesai') {
            $title = 'Pesanan Selesai';
            $message = "Pesanan Anda {$order->order_number} telah selesai. Terima kasih telah berbelanja!";
        } else if ($newStatus === 'dibatalkan') {
            $title = 'Pesanan Dibatalkan';
            $message = "Pesanan Anda {$order->order_number} telah dibatalkan oleh apoteker.";
        } else if ($newStatus === 'dilaporkan') {
            $title = 'Laporan Masalah Pesanan';
            $message = "Pesanan Anda {$order->order_number} dilaporkan bermasalah. Kami akan segera memeriksanya.";
        }

        if ($title && $message) {
            $order->user->notify(new AppNotification($title, $message, 'order'));
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Status pesanan berhasil diperbarui',
            'data' => $order
        ]);
    }

    public function confirmReceived(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);
        $currentStatus = strtolower(trim((string) $order->status));

        if (in_array($currentStatus, ['selesai', 'completed'], true)) {
            return response()->json([
                'status' => 'success',
                'message' => 'Pesanan sudah selesai.',
                'data' => $order,
            ]);
        }

        if (!in_array($currentStatus, ['dikirim', 'shipped'], true)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan belum dikirim. Tunggu apoteker mengirim pesanan Anda.',
            ], 400);
        }

        $order->status = 'selesai';
        $order->save();

        $order->user->notify(new AppNotification(
            'Pesanan Selesai',
            "Pesanan {$order->order_number} telah Anda terima. Terima kasih telah berbelanja!",
            'success'
        ));

        return response()->json([
            'status' => 'success',
            'message' => 'Terima kasih! Pesanan telah selesai.',
            'data' => $order->fresh(),
        ]);
    }

    public function reportIssue(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);
        
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $order->update([
            'status' => 'dilaporkan',
            'notes' => $order->notes . "\n[LAPORAN USER]: " . $request->reason
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Laporan Anda telah terkirim. Apoteker akan segera meninjau.',
            'data' => $order
        ]);
    }

    public function confirmPayment(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);
        
        if ($order->payment_status !== 'pending' || $order->status !== 'menunggu_pembayaran') {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan ini sudah dibayar atau tidak berstatus menunggu pembayaran.'
            ], 400);
        }

        $order->update([
            'payment_status' => 'waiting_confirmation',
            'status' => 'menunggu_konfirmasi',
            'payment_method' => $request->input('payment_method', 'QRIS')
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Pembayaran Anda sedang diverifikasi oleh apoteker. Harap tunggu.',
            'data' => $order
        ]);
    }

    public function verifyPayment(Request $request, $id)
    {
        $userRole = $request->user()->role;
        if ($userRole !== 'admin' && $userRole !== 'apoteker') {
            return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
        }

        $order = Order::findOrFail($id);
        
        if ($order->payment_status !== 'waiting_confirmation') {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan ini tidak dalam status menunggu konfirmasi pembayaran.'
            ], 400);
        }

        $order->update([
            'payment_status' => 'paid',
            'status' => 'perlu_diproses',
            'payment_confirmed_at' => now(),
        ]);

        // Send Notification to User
        $order->user->notify(new AppNotification(
            'Pembayaran Berhasil Diverifikasi',
            "Pembayaran untuk pesanan {$order->order_number} telah berhasil diverifikasi oleh apoteker dan sekarang sedang disiapkan.",
            'order'
        ));

        return response()->json([
            'status' => 'success',
            'message' => 'Pembayaran berhasil dikonfirmasi.',
            'data' => $order
        ]);
    }

    public function cancelOrder(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:500'
        ]);

        $order = Order::findOrFail($id);
        $user = $request->user();

        // Members can only cancel their own pending orders
        if ($user->role === 'member') {
            if ($order->user_id !== $user->id) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
            }
            if ($order->status !== 'menunggu_pembayaran') {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Pesanan tidak dapat dibatalkan pada status ini.'
                ], 400);
            }
        } else if ($user->role === 'apoteker') {
            return response()->json([
                'status' => 'error',
                'message' => 'Apoteker tidak diperbolehkan membatalkan pesanan.'
            ], 403);
        } else if ($user->role !== 'admin') {
            return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
        }

        // Update status and append cancellation reason
        $actor = $user->role === 'member' ? 'Pengguna' : ($user->role === 'apoteker' ? 'Apoteker' : 'Admin');
        $cancellationNote = "\n[BATAL OLEH {$actor}]: {$request->reason}";

        $order->update([
            'status' => 'dibatalkan',
            'notes' => $order->notes . $cancellationNote
        ]);

        // Return stock back
        foreach ($order->items as $item) {
            $medicine = \App\Models\Medicine::find($item->medicine_id);
            if ($medicine) {
                $medicine->increment('stock', $item->quantity);
            }
        }

        // Kirim Notifikasi
        $order->user->notify(new AppNotification(
            'Pesanan Dibatalkan',
            "Pesanan {$order->order_number} telah dibatalkan. Alasan: {$request->reason}",
            'order'
        ));

        return response()->json([
            'status' => 'success',
            'message' => 'Pesanan berhasil dibatalkan.',
            'data' => $order->load('items')
        ]);
    }
}

