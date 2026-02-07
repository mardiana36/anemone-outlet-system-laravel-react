<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Anemone Outlet System API',
        'version' => '1.0',
        'docs' => 'Please use API endpoints at /api/*'
    ]);
});