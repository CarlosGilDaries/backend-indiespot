<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
//use Illuminate\Support\Str;

class LoginController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
        public function register(Request $request)
    {
        try {
            $user = User::create([
                        'name' => $request->name,
                        'surname_1' => $request->surname1,
                        'surname_2' => $request->surname2 ?? null,
                        'email' => $request->email,
                        'type' => 'user',
                        'curriculum' => $request->curriculum ?? null,
                        'portfolio' => $request->portfolio ?? null,
                        'director' => $request->director,
                        'password' => Hash::make($request->password),
                    ]);

            //$device_id = Hash::make(Str::uuid());

            $token = $user->createToken($request->email)->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ],
                'message' => 'Usuario registrado con éxito.'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

        public function login(Request $request)
    {
        try {
            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales incorrectas.'
                ], 401);
            }
            
            $device_id = $request->header('User-Device-ID');
            $ip = $request->header('User-IP');
            $userAgent = $request->header('User-Agent');

            $session = UserSession::where('user_id', $user->id)
            ->where('device_id', $device_id)
            ->where('ip_address', $ip)
            ->where('user_agent', $userAgent)
            ->first();

            if (!$session) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'require_device_registration' => true,
                        'user' => $user,
                        'auth_token' => $user->createToken($user->email)->plainTextToken
                    ],
                    'message' => 'Por favor registre este dispositivo'
                ], 201);
            }

            $token = $user->createToken($user->email)->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'auth_token' => $token
                ],
                'message' => 'Inicio de sesión con éxito'
            ], 201);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }

        public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Sesión cerrada exitosamente'
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
