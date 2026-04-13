<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\StaffPermission;

class CheckPermission
{
    public function handle(Request $request, Closure $next, string $permission): mixed
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Owners always pass — they have all permissions by definition
        if ($user->isOwner()) {
            return $next($request);
        }

        // Clients never pass through permission middleware
        if ($user->isClient()) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        // Staff pass only if they have been granted this specific permission
        if ($user->isStaff()) {
            $business = $request->route('business');

            if (!$business) {
                return response()->json(['message' => 'Business not found.'], 404);
            }

            $hasPermission = StaffPermission::where('user_id', $user->id)
                ->where('business_id', $business->id)
                ->where('permission', $permission)
                ->exists();

            if ($hasPermission) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Forbidden. You do not have the required permission.'], 403);
    }
}