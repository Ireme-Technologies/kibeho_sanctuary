<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $this->ensureCanManageUsers($request);

        return response()->json(User::query()->orderBy('name')->get());
    }

    public function store(Request $request)
    {
        $this->ensureCanManageUsers($request);

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8'],
            'role' => ['nullable', 'string', Rule::in(['super_admin', 'editor'])],
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => strtolower(trim($data['email'])),
            'password' => $data['password'],
            'role' => $data['role'] ?? 'super_admin',
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, User $user)
    {
        $this->ensureCanManageUsers($request);

        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', 'string', 'min:8'],
            'role' => ['nullable', 'string', Rule::in(['super_admin', 'editor'])],
        ]);

        if (empty($data['password'])) {
            unset($data['password']);
        }

        if (isset($data['email'])) {
            $data['email'] = strtolower(trim($data['email']));
        }

        $user->update($data);

        return response()->json($user->fresh());
    }

    public function destroy(Request $request, User $user)
    {
        $this->ensureCanManageUsers($request);

        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'Cannot delete your own account.'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'Deleted.']);
    }

    private function ensureCanManageUsers(Request $request): void
    {
        if (! $request->user()?->canManageUsers()) {
            abort(403, 'Only @iremetech.com accounts can manage users.');
        }
    }
}
