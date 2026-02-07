<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
          if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        if ($role === 'ho' && !$request->user()->isHO()) {
            return response()->json(['message' => 'Unauthorized. HO only.'], 403);
        }

        if ($role === 'outlet' && !$request->user()->isOutlet()) {
            return response()->json(['message' => 'Unauthorized. Outlet only.'], 403);
        }

        return $next($request);
    }
}
