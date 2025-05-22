<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
       /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $users = User::with('rol')->where('type', '!=', 'admin')->get();

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
    public function show(string $id)
    {
        try {
            $user = User::where('id', $id)->first();
            $content = $user->contents()->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $user,
                    'content' => $content,
                ],
                'message' => 'Usuario obtenido con éxito.'
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
    public function getCurrentUser() 
    {
        try {
            $user = Auth::user();
            $rol = Rol::where('id', $user->rol_id)->first();

            return response()->json([
                'success' => true,
                'user' => $user,
                'rol' => $rol,
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
    public function update(Request $request, $id)
    {
        try {
           $user = User::where('id', $id)->first();
            $curriculum = $request->file('curriculum');
            if ($curriculum) {
                $cvExtension = $curriculum->getClientOriginalExtension();
                Storage::disk('private')->delete('users/user-' . $user->id, '/user-' . $user->id . '-cv.' . $cvExtension, 'private');
                $curriculum->storeAs('users/user-' . $user->id, '/user-' . $user->id . '-cv.' . $cvExtension, 'private');
            }
            $user->name = $request->input('name');
            $user->surnames = $request->input('surnames');
            $user->email = $request->input('email');
            $user->portfolio = $request->input('portfolio') ?? null;
            $user->rol_id = $request->input('rol');
            $user->password = Hash::make($request->password);

            $user->save();

            return response()->json([
                'success' => true,
                'user' => $user,
                'message' => 'Usuario editado con éxito.'
            ], 200);

        } catch(\Exception $e) {
            Log::error('Error al editar el usuario: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        try {
            $id = $request->input('content_id');
            $user = User::where('id', $id)->first();
            Storage::disk('private')->deleteDirectory('users/user-' . $user->id);
            $user->delete();

            return response()->json([
                'success' => true,
                'message' => 'Usuario eliminado con éxito'
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
