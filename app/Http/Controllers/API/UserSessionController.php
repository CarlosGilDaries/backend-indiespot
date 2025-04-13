<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class UserSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         try {
            $deviceId = $request->header('User-Device-Id');
            $ip = $request->header('User-Ip');
            $userAgent = $request->header('User-Agent');
            $user = Auth::user();

            $session = UserSession::create([
                'user_id' => $user->id,
                'device_id' => $deviceId,
                'device_name' => $request->device_name,
                'ip_address' => $ip,
                'user_agent' => $userAgent,
            ]);

            return response()->json([
                'success' => true,
                'data' => $session,
                'message' => 'Dispositivo registrado exitosamente'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(UserSession $userSession)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, UserSession $userSession)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(UserSession $userSession)
    {
        //
    }
}
