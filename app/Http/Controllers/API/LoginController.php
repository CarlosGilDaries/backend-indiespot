<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\UserSession;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LoginController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
        public function register(Request $request)
    {
        try {
            $email = $request->input('email');

            $curriculum = $request->file('curriculum');
            if ($curriculum) {
                $cvExtension = $curriculum->getClientOriginalExtension();
                $cvUrl = '/file/' . $email . '/' . $email . '-cv.' . $cvExtension;
                $curriculum->storeAs('users/' . $email, $email . '-cv.' . $cvExtension, 'private');
            }

            $user = User::create([
                        'name' => $request->input('name'),
                        'surnames' => $request->input('surnames'),
                        'email' => $request->input('email'),
                        'type' => 'user',
                        'curriculum' => $cvUrl ?? null,
                        'portfolio' => $request->input('portfolio') ?? null,
                        'rol_id' => $request->input('rol'),
                        'password' => Hash::make($request->password),
                    ]);

            //$device_id = Hash::make(Str::uuid());

            $token = $user->createToken($request->email)->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user->only(['id', 'name', 'surnames', 'email']),
                    'require_device_registration' => true,
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
            Log::debug($device_id);
            $ip = $request->header('User-IP');
            $userAgent = $request->header('User-Agent');

            $session = UserSession::where('user_id', $user->id)
            ->where('device_id', $device_id)
            ->where('ip_address', $ip)
            ->where('user_agent', $userAgent)
            ->first();

            if ($user->type == 'admin') {
                $session = UserSession::where('user_id', $user->id)->first();

                if (!$session) {
                    $deviceId = Str::uuid();

                    $newSession = UserSession::create([
                        'user_id' => $user->id,
                        'device_name' => 'admin',
                        'device_id' => $deviceId,
                        'ip_address' => $ip,
                        'user_agent' => $userAgent
                    ]);

                    $token = $user->createToken($user->name . '/' . $user->email)->plainTextToken;

                    return response()->json([
                        'success' => true,
                        'data' => [
                            'user' => $user->email,
                            'auth_token' => $token,
                            'session' => $newSession
                        ],
                        'message' => 'Inicio de sesión exitoso'
                    ], 200);
                }

                $token = $user->createToken($user->name . '/' . $user->email)->plainTextToken;

                return response()->json([
                    'success' => true,
                    'data' => [
                        'user' => $user,
                        'auth_token' => $token,
                        'session' => $session
                    ],
                    'message' => 'Inicio de sesión exitoso'
                ], 200);
            }

            if (!$session) {
                $newDeviceIdFound = UserSession::where('user_id', $user->id)->first();
                if ($newDeviceIdFound) {
                    return response()->json([
                    'success' => false,
                    'message' => 'Has alcanzado el límite de dispositivos permitidos',
                    'device_limit_reached' => true,
                    'current_devices' => UserSession::where('user_id', $user->id)->get(),
                    'data' => [
                        'auth_token' => $user->createToken($user->email)->plainTextToken,
                        'user' => $user->only(['id', 'name', 'surnames', 'email'])
                    ]
                ], 403);
                }

                return response()->json([
                    'success' => true,
                    'data' => [
                        'require_device_registration' => true,
                        'user' => $user->only(['id', 'name', 'surnames', 'email']),
                        'auth_token' => $user->createToken($user->email)->plainTextToken
                    ],
                    'message' => 'Por favor registre este dispositivo'
                ], 201);
            }

            $token = $user->createToken($user->email)->plainTextToken;

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user->only(['id', 'name', 'surnames', 'email']),
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
