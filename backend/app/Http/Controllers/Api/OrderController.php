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
            ->with('items')
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
        ]);

        $user = $request->user();
        $cart = Cart::where('user_id', $user->id)->first();

        if (!$cart || $cart->items()->count() === 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Cart is empty'
            ], 400);
        }

        return DB::transaction(function () use ($user, $cart, $request) {
            $totalPrice = 0;
            $cartItems = $cart->items()->with('medicine')->get();

            // Hitung total harga
            foreach ($cartItems as $item) {
                $totalPrice += $item->price * $item->quantity;
            }

            // Buat Order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => 'ORD-' . strtoupper(Str::random(10)),
                'status' => 'pending',
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

            }

            // Kosongkan keranjang
            $cart->items()->delete();

            // Kirim Notifikasi
            $user->notify(new AppNotification(
                'Pesanan Berhasil',
                "Pesanan {$order->order_number} telah berhasil dibuat. Silakan tunggu konfirmasi selanjutnya.",
                'order'
            ));

            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully',
                'data' => $order->load('items')
            ], 201);
        });
    }

    public function show(Request $request, $id)
    {
        $order = Order::with(['items', 'user'])->findOrFail($id);


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

        $orders = Order::with(['user', 'items'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $orders
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        if ($request->user()->role !== 'admin' && $request->user()->role !== 'apoteker') {
            return response()->json(['status' => 'error', 'message' => 'Forbidden'], 403);
        }

        $request->validate([
            'status' => 'required|in:pending,diproses,dikirim,selesai,dibatalkan,dilaporkan'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json([
            'status' => 'success',
            'message' => 'Status pesanan berhasil diperbarui',
            'data' => $order
        ]);
    }

    public function confirmReceived(Request $request, $id)
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);
        
        if ($order->status !== 'dikirim' && $order->status !== 'selesai') {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan belum dikirim atau sudah selesai'
            ], 400);
        }

        $order->update(['status' => 'selesai']);

        return response()->json([
            'status' => 'success',
            'message' => 'Terima kasih! Pesanan telah selesai.',
            'data' => $order
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
        
        if ($order->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Pesanan ini sudah dibayar atau tidak berstatus pending.'
            ], 400);
        }

        $order->update(['status' => 'diproses']);

        return response()->json([
            'status' => 'success',
            'message' => 'Pembayaran berhasil dikonfirmasi! Pesanan Anda sedang diproses oleh apoteker.',
            'data' => $order
        ]);
    }
}

