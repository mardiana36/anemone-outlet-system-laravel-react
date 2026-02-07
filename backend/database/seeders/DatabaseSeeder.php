<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
       // Create HO User
        User::create([
            'name' => 'Head Office',
            'email' => 'ho@anemone.com',
            'password' => Hash::make('password'),
            'role' => 'ho',
        ]);

        // Create Outlet Users
        User::create([
            'name' => 'Outlet Jakarta',
            'email' => 'outlet1@anemone.com',
            'password' => Hash::make('password'),
            'role' => 'outlet',
        ]);

        User::create([
            'name' => 'Outlet Surabaya',
            'email' => 'outlet2@anemone.com',
            'password' => Hash::make('password'),
            'role' => 'outlet',
        ]);

        // Create Products
        $products = [
            ['name' => 'Buku Matematika', 'price' => 50000, 'stock' => 100],
            ['name' => 'Modul IPA', 'price' => 75000, 'stock' => 80],
            ['name' => 'Alat Tulis Paket', 'price' => 30000, 'stock' => 150],
            ['name' => 'Buku Bahasa Inggris', 'price' => 60000, 'stock' => 60],
            ['name' => 'Kalkulator Scientific', 'price' => 120000, 'stock' => 40],
            ['name' => 'Atlas Indonesia', 'price' => 45000, 'stock' => 75],
            ['name' => 'Paket Pensil Warna', 'price' => 25000, 'stock' => 200],
            ['name' => 'Buku Tata Bahasa', 'price' => 55000, 'stock' => 90],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
