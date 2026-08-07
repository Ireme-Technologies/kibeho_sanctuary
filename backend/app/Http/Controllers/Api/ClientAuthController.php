<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PilgrimEnquiry;
use App\Models\User;
use App\Services\EmailValidator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\ValidationException;

class ClientAuthController extends Controller
{
    public function register(Request $request, EmailValidator $emails)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],
            'phone' => ['nullable', 'string', 'max:50'],
        ]);

        $emails->assertDeliverable($data['email']);

        $user = User::create([
            'name' => $data['name'],
            'email' => strtolower(trim($data['email'])),
            'password' => $data['password'], // hashed cast
            'role' => 'client',
        ]);

        PilgrimEnquiry::query()
            ->whereNull('user_id')
            ->where('email', $user->email)
            ->update(['user_id' => $user->id]);

        Auth::login($user, true);
        $request->session()->regenerate();

        return response()->json(['user' => $user], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $credentials['email'] = strtolower(trim($credentials['email']));

        if (! Auth::attempt($credentials, true)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = $request->user();
        if (! $user->isClient()) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => ['This account is not a client portal account.'],
            ]);
        }

        $request->session()->regenerate();

        PilgrimEnquiry::query()
            ->whereNull('user_id')
            ->where('email', $user->email)
            ->update(['user_id' => $user->id]);

        return response()->json(['user' => $user]);
    }
}
