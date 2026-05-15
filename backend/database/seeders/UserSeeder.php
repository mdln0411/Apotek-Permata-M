<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::create([
            'name' => 'Admin Apotek',
            'email' => 'admin@apotek.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'phone' => '081234567890',
            'address' => 'Jl. Admin No. 1',
        ]);

        // Apoteker
        User::create([
            'name' => 'Apoteker Permata',
            'email' => 'apoteker@apotek.com',
            'password' => Hash::make('password123'),
            'role' => 'apoteker',
            'phone' => '081234567891',
            'address' => 'Jl. Apotek No. 2',
        ]);

        // Member
        User::create([
            'name' => 'Member Setia',
            'email' => 'member@apotek.com',
            'password' => Hash::make('password123'),
            'role' => 'member',
            'phone' => '081234567892',
            'address' => 'Jl. Member No. 3',
        ]);
    }
}
