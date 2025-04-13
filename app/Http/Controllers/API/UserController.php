<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
       /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $users = User::all();

            return response()->json([
                'success' => true,
                'users' => $users,
                'message' => 'Usuarios obtenido con éxito.'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function getCurrentUser(Request $request) 
    {
        try {
            $user = Auth::user();
            //Obtener todos los contenidos donde un usuario es actor:
            //$actorContents = $user->contentsWithRole($actorRoleId)->get();

            //Obtener todos los favoritos de un usuario:
            //$favorites = $user->favorites;

            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => 'Usuario obtenido con éxito'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
