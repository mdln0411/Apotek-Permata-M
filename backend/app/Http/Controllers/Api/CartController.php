<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Medicine;
use App\Services\MedicineUnitService;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);
        $items = $cart->items()->with('medicine')->get();

        // Format data agar mudah dibaca frontend
        $formattedItems = $items->map(function ($item) {
            return [
                'id' => $item->id,
                'medicine_id' => $item->medicine_id,
                'name' => MedicineUnitService::displayName($item->medicine->name, $item->medicine->unit),
                'price' => (float) $item->price,
                'price_formatted' => 'Rp ' . number_format($item->price, 0, ',', '.'),
                'quantity' => $item->quantity,
                'subtotal' => (float) ($item->price * $item->quantity),
                'subtotal_formatted' => 'Rp ' . number_format($item->price * $item->quantity, 0, ',', '.'),
                'image_url' => $item->medicine->image_url,
                'category' => $item->medicine->category,
                'unit' => MedicineUnitService::displayUnit($item->medicine->unit),
                'stock' => $item->medicine->stock,
            ];
        });

        return response()->json([
            'status' => 'success',
            'data' => $formattedItems,
            'total_price' => $formattedItems->sum('subtotal'),
            'total_price_formatted' => 'Rp ' . number_format($formattedItems->sum('subtotal'), 0, ',', '.'),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'medicine_id' => 'required|exists:medicines,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $medicine = Medicine::findOrFail($request->medicine_id);

        if (!$medicine->is_active) {
            return response()->json(['status' => 'error', 'message' => 'Obat tidak tersedia.'], 400);
        }

        $available = max(0, (int) $medicine->stock);
        if ($available < 1) {
            return response()->json(['status' => 'error', 'message' => 'Stok obat habis.'], 400);
        }

        $cart = Cart::firstOrCreate(['user_id' => $request->user()->id]);

        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('medicine_id', $medicine->id)
            ->first();

        $requestedQty = (int) $request->quantity;
        $newQty = $requestedQty + ($cartItem ? (int) $cartItem->quantity : 0);
        if ($newQty > $available) {
            return response()->json([
                'status' => 'error',
                'message' => "Stok tidak mencukupi. Maksimal {$available} unit.",
            ], 400);
        }

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $cartItem->quantity + $request->quantity,
                'price' => $medicine->price, // Update ke harga terbaru
            ]);
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'medicine_id' => $medicine->id,
                'quantity' => $request->quantity,
                'price' => $medicine->price,
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Item added to cart',
            'data' => $cartItem
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem = CartItem::with('medicine')->findOrFail($id);
        
        // Pastikan item milik user yang login
        if ($cartItem->cart->user_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $available = max(0, (int) ($cartItem->medicine->stock ?? 0));
        $requestedQty = (int) $request->quantity;
        if ($requestedQty > $available) {
            return response()->json([
                'status' => 'error',
                'message' => "Stok tidak mencukupi. Maksimal {$available} unit.",
            ], 400);
        }

        $cartItem->update(['quantity' => $requestedQty]);

        return response()->json([
            'status' => 'success',
            'message' => 'Cart item updated',
            'data' => $cartItem
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $cartItem = CartItem::findOrFail($id);

        if ($cartItem->cart->user_id !== $request->user()->id) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Item removed from cart'
        ]);
    }
}
