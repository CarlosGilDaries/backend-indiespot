<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class ContentRolUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            foreach($request->users as $user) {
                $bdUser = User::where('id', $user['id'])->first();
                DB::table('content_rol_user')->insert([
                    'content_id' => $request->content_id,
                    'user_id' => $user['id'],
                    'rol_id' => $bdUser->rol->id,                   
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Usuarios y roles vinculados al contenido con éxito.'
            ], 201);
            
        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }  
    }

    /**
     * Display the specified resource.
     */
    public function show($slug)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        try {
            $movieId = $request->input('content_id');
            $userId = $request->input('user_id');
            
            DB::table('content_rol_user')
                ->where('content_id', $movieId)
                ->where('user_id', $userId)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuario desvinculado con éxito'
            ], 200);

        } catch(\Exception $e) {
            Log::error('Error al eliminar el usuario: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
