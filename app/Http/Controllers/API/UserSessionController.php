<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\UserSession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class UserSessionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $user = Auth::user();
            $userSessions = UserSession::where('user_id', $user->id)
                ->select(['id', 'device_name'])
                ->get();

            return response()->json([
                'success' => true,
                'devices' => $userSessions,
                'message' => 'Dispositivos obtenidos con éxito.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
         try {
            $ip = $request->header('User-Ip');
            $userAgent = $request->header('User-Agent');
            $user = Auth::user();
            $deviceId = Str::uuid()->toString();

            $session = UserSession::create([
                'user_id' => $user->id,
                'device_id' => $deviceId,
                'device_name' => $request->device_name,
                'ip_address' => $ip,
                'user_agent' => $userAgent,
            ]);

            return response()->json([
                'success' => true,
                'data' => $deviceId,
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
    public function destroy(Request $request)
    {
        try {
            $id = $request->input('id');
            UserSession::where('id', $id)->delete();

            return response()->json([
                'success' => true,
                'message' => 'Dispositivo eliminado exitosamente'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function checkDeviceId(Request $request)
    {
        try {
            $deviceIds = $request->header('User-Device-Id');
            $deviceIdsArray = explode(',', $deviceIds);           
            // Eliminar espacios en blanco y valores vacíos
            $deviceIdsArray = array_filter(array_map('trim', $deviceIdsArray));
            
            if (empty($deviceIdsArray)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se proporcionaron device_ids'
                ], 400);
            }

            $existingSessions = UserSession::whereIn('device_id', $deviceIdsArray)->get();
            $existingDeviceIds = $existingSessions->pluck('device_id')->toArray();
            $missingDeviceIds = array_diff($deviceIdsArray, $existingDeviceIds);
            
            $response = [
                'success' => true,
                'message' => 'Verificación completada',
                'results' => []
            ];
            
            foreach ($deviceIdsArray as $deviceId) {
                $exists = in_array($deviceId, $existingDeviceIds);
                $response['results'][] = [
                    'device_id' => $deviceId,
                    'exists' => $exists,
                    'message' => $exists ? 'Device_id verificado' : 'Device_id no encontrado'
                ];
            }
            
            // Si hay device_ids faltantes, agregar información adicional
            if (!empty($missingDeviceIds)) {
                $response['has_missing'] = true;
                $response['missing_count'] = count($missingDeviceIds);
                $response['missing_device_ids'] = array_values($missingDeviceIds);
                $response['message'] = 'Algunos device_ids no fueron encontrados';
                
                return response()->json($response, 200);
            }
            
            $response['has_missing'] = false;
            $response['message'] = 'Todos los device_ids fueron verificados correctamente';
            
            return response()->json($response, 200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
