<?php
/*
|--------------------------------------------------------------------------
| RoleMiddleware - Apotek Permata
|--------------------------------------------------------------------------
*/

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || $request->user()->role !== $role) {
            return response()->json([
                'status' => 'error',
                'message' => 'Forbidden: You do not have the required role (' . $role . ')'
            ], 403);
        }

        return $next($request);
    }
}
