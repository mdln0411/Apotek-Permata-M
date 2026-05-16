<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Medicine;
use App\Models\User;
use App\Models\Order;
use Illuminate\Support\Facades\Hash;

class AdminDataSeeder extends Seeder
{
    public function run()
    {
        // 1. Create Dummy Medicines
        $medicines = [
            ['name' => 'Paracetamol 500mg', 'category' => 'Pain Relief', 'price' => 15000, 'stock' => 100, 'prescription_required' => false],
            ['name' => 'Amoxicillin 500mg', 'category' => 'Antibiotics', 'price' => 45000, 'stock' => 50, 'prescription_required' => true],
            ['name' => 'Vitamin C 1000mg', 'category' => 'Vitamins', 'price' => 35000, 'stock' => 200, 'prescription_required' => false],
            ['name' => 'Ibuprofen 400mg', 'category' => 'Pain Relief', 'price' => 25000, 'stock' => 75, 'prescription_required' => false],
            ['name' => 'Omeprazole 20mg', 'category' => 'Digestive', 'price' => 55000, 'stock' => 40, 'prescription_required' => true],
        ];

        foreach ($medicines as $med) {
            Medicine::updateOrCreate(['name' => $med['name']], $med);
        }

        // 2. Create Dummy Users
        User::updateOrCreate(['email' => 'admin@permata.com'], [
            'name' => 'Admin Permata',
            'password' => Hash::make('password'),
            'role' => 'admin'
        ]);

        User::updateOrCreate(['email' => 'member@test.com'], [
            'name' => 'Medelain',
            'password' => Hash::make('password'),
            'role' => 'member'
        ]);

        User::updateOrCreate(['email' => 'apoteker@test.com'], [
            'name' => 'apt. Sarah Angelica',
            'password' => Hash::make('password'),
            'role' => 'apoteker'
        ]);

        echo "Data dummy Admin, User, dan Obat berhasil ditambahkan!\n";
    }
}
