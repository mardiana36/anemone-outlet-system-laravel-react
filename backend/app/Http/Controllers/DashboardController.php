<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;

class DashboardController extends Controller
{

    // GET /api/dashboard/summary
    public function summary(Request $request)
    {
        // Hanya HO yang bisa akses dashboard
        if ($request->user()->role !== 'ho') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. HO only.'
            ], 403);
        }
        
        $totalOrders = Order::count();
        $totalSales = Order::sum('total_price');
        
        $statusSummary = [
            'pending' => Order::where('status', 'pending')->count(),
            'paid' => Order::where('status', 'paid')->count(),
            'shipped' => Order::where('status', 'shipped')->count(),
        ];
        
        return response()->json([
            'success' => true,
            'data' => [
                'total_orders' => $totalOrders,
                'total_sales' => (float) $totalSales,
                'status_summary' => $statusSummary,
            ]
        ]);
    }
}