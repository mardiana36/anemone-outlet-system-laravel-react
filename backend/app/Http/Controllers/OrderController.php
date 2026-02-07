<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{

    // POST /api/orders
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        // Hanya outlet yang bisa membuat order
        if ($request->user()->role !== 'outlet') {
            return response()->json([
                'success' => false,
                'message' => 'Only outlets can create orders'
            ], 403);
        }

        try {
            return DB::transaction(function () use ($request) {
                $totalPrice = 0;
                $orderItems = [];
                
                // Loop items untuk validasi dan hitung total
                foreach ($request->items as $item) {
                    $product = Product::lockForUpdate()->find($item['product_id']);
                    
                    if (!$product) {
                        throw new \Exception("Product not found");
                    }
                    
                    // Validasi stok
                    if ($product->stock < $item['quantity']) {
                        throw new \Exception("Insufficient stock for product: {$product->name}. Available: {$product->stock}");
                    }
                    
                    $itemPrice = $product->price * $item['quantity'];
                    $totalPrice += $itemPrice;
                    
                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                    ];
                    
                    // Kurangi stok
                    $product->decrement('stock', $item['quantity']);
                }
                
                // Buat order
                $order = Order::create([
                    'outlet_id' => $request->user()->id,
                    'total_price' => $totalPrice,
                    'status' => 'pending',
                ]);
                
                // Tambah order_id ke setiap item
                foreach ($orderItems as &$item) {
                    $item['order_id'] = $order->id;
                    $item['created_at'] = now();
                    $item['updated_at'] = now();
                }
                
                // Insert semua items sekaligus
                OrderItem::insert($orderItems);
                
                // Load relasi
                $order->load(['items.product']);
                
                return response()->json([
                    'success' => true,
                    'message' => 'Order created successfully',
                    'data' => $order
                ], 201);
            });
        } catch (\Exception $e) {
            Log::error('Order creation failed: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to create order: ' . $e->getMessage()
            ], 500);
        }
    }

    // GET /api/orders
    public function index(Request $request)
    {
        $user = $request->user();
        
        if ($user->role === 'ho') {
            $orders = Order::with(['outlet', 'items.product'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $orders = Order::with('items.product')
                ->where('outlet_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();
        }
        
        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    // PUT /api/orders/{id}/status
    public function updateStatus(Request $request, $id)
    {
        // Hanya HO yang bisa update status
        if ($request->user()->role !== 'ho') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. HO only.'
            ], 403);
        }
        
        $request->validate([
            'status' => 'required|in:pending,paid,shipped',
        ]);
        
        $order = Order::find($id);
        
        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }
        
        $order->update(['status' => $request->status]);
        
        return response()->json([
            'success' => true,
            'message' => 'Status updated successfully',
            'data' => $order
        ]);
    }
}