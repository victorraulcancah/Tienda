<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Usuario de prueba que anuncia la pantalla de login (contraseña: password)
        User::factory()->create([
            'name' => 'Administrador',
            'email' => 'admin@tienda.com',
        ]);
    }
}
