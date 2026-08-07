<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $password = (string) config('admin.password');
        $masterEmail = strtolower(trim((string) config('admin.master_email')));
        $name = (string) config('admin.name', 'Master Admin');

        if ($masterEmail === '' || ! filter_var($masterEmail, FILTER_VALIDATE_EMAIL)) {
            throw new RuntimeException('MASTER_ADMIN_EMAIL / admin.master_email is missing or invalid.');
        }

        if (strlen($password) < 8) {
            throw new RuntimeException('ADMIN_PASSWORD / admin.password must be at least 8 characters.');
        }

        $this->seedAdmin($masterEmail, $name, $password, 'super_admin');

        $legacy = strtolower(trim((string) config('admin.email')));
        if ($legacy !== '' && $legacy !== $masterEmail) {
            $this->seedAdmin($legacy, 'Site Admin', $password, 'super_admin');
        }
    }

    private function seedAdmin(string $email, string $name, string $plainPassword, string $role): void
    {
        // Pass the plain password — User::$casts['password' => 'hashed'] hashes once.
        $user = User::query()->updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => $plainPassword,
                'role' => $role,
            ]
        );

        $user->refresh();

        if (! Hash::check($plainPassword, $user->password)) {
            throw new RuntimeException("Admin password hash verification failed for {$email}.");
        }

        if ($this->command) {
            $this->command->info("Admin ready: {$email} (role: {$role})");
        }
    }
}
