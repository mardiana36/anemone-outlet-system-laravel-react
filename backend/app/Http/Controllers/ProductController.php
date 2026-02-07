<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProductController extends Controller
{

    // GET /api/products
    public function index()
    {
        $products = Product::all();
        
        return response()->json([
            'success' => true,
            'data' => $products
        ]);
    }

    // POST /api/products (HO only)
    public function store(Request $request)
    {
        // Cek role HO
        if ($request->user()->role !== 'ho') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. HO only.'
            ], 403);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $product = Product::create([
            'name' => $request->name,
            'price' => $request->price,
            'stock' => $request->stock,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Product created successfully',
            'data' => $product
        ], 201);
    }
}