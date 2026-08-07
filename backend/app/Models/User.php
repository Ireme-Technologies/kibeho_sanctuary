<?php

namespace App\Models;

use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements CanResetPasswordContract
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use CanResetPassword, HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $appends = [
        'is_master_admin',
        'can_manage_users',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function isSuperAdmin(): bool
    {
        return in_array($this->role, ['super_admin', 'editor'], true) || $this->isMasterAdmin();
    }

    public function isClient(): bool
    {
        return $this->role === 'client';
    }

    public function isMasterAdmin(): bool
    {
        $master = strtolower(trim((string) config('admin.master_email', 'admin@iremetech.com')));

        return strtolower(trim((string) $this->email)) === $master;
    }

    /**
     * Users with an @iremetech.com email can manage the Users screen.
     */
    public function canManageUsers(): bool
    {
        $domain = strtolower(trim((string) config('admin.users_access_domain', 'iremetech.com')));
        if ($domain === '') {
            return false;
        }

        $email = strtolower(trim((string) $this->email));
        $suffix = '@'.$domain;

        return str_ends_with($email, $suffix);
    }

    public function getIsMasterAdminAttribute(): bool
    {
        return $this->isMasterAdmin();
    }

    public function getCanManageUsersAttribute(): bool
    {
        return $this->canManageUsers();
    }
}
