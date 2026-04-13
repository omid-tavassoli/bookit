<?php

namespace App\Http\Controllers;

use App\Models\Business;
use App\Models\StaffPermission;
use App\Models\User;
use Illuminate\Http\Request;

class StaffPermissionController extends Controller
{
    // GET /api/businesses/{business}/staff/{user}/permissions
    public function index(Business $business, User $user)
    {
        if (!$user->isStaff()) {
            return response()->json(['message' => 'This user is not a staff member.'], 422);
        }

        $permissions = StaffPermission::where('user_id', $user->id)
            ->where('business_id', $business->id)
            ->pluck('permission');

        return response()->json([
            'user'        => $user->only('id', 'name', 'email'),
            'business_id' => $business->id,
            'permissions' => $permissions,
        ]);
    }

    // POST /api/businesses/{business}/staff/{user}/permissions
    public function grant(Request $request, Business $business, User $user)
    {
        if (!$user->isStaff()) {
            return response()->json(['message' => 'This user is not a staff member.'], 422);
        }

        $validated = $request->validate([
            'permission' => 'required|in:view_bookings,confirm,cancel,reschedule,complete,manage_overrides',
        ]);

        StaffPermission::updateOrCreate(
            [
                'user_id'     => $user->id,
                'business_id' => $business->id,
                'permission'  => $validated['permission'],
            ]
        );

        return response()->json([
            'message'    => "Permission '{$validated['permission']}' granted.",
            'user'       => $user->only('id', 'name', 'email'),
            'permission' => $validated['permission'],
        ], 201);
    }

    // DELETE /api/businesses/{business}/staff/{user}/permissions/{permission}
    public function revoke(Business $business, User $user, string $permission)
    {
        if (!$user->isStaff()) {
            return response()->json(['message' => 'This user is not a staff member.'], 422);
        }

        $deleted = StaffPermission::where('user_id', $user->id)
            ->where('business_id', $business->id)
            ->where('permission', $permission)
            ->delete();

        if (!$deleted) {
            return response()->json(['message' => 'Permission not found.'], 404);
        }

        return response()->json(['message' => "Permission '{$permission}' revoked."]);
    }

    public function listStaff(Business $business)
    {
        $staffUsers = \App\Models\User::where('role', 'staff')
            ->whereHas('staffPermissions', function ($q) use ($business) {
                $q->where('business_id', $business->id);
            })
            ->with(['staffPermissions' => function ($q) use ($business) {
                $q->where('business_id', $business->id);
            }])
            ->get()
            ->map(function ($user) {
                return [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'permissions' => $user->staffPermissions->pluck('permission'),
                ];
            });

        return response()->json($staffUsers);
    }

    public function searchUser(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $user = \App\Models\User::where('email', $validated['email'])
            ->where('role', 'staff')
            ->first();

        if (!$user) {
            return response()->json(['message' => 'No staff member found with that email.'], 404);
        }

        return response()->json([
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
        ]);
    }

    public function myPermissions(Request $request, Business $business)
    {
        $permissions = StaffPermission::where('user_id', $request->user()->id)
            ->where('business_id', $business->id)
            ->pluck('permission');

        return response()->json(['permissions' => $permissions]);
    }
}