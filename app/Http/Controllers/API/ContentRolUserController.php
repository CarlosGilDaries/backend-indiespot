<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Content;

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
                DB::table('content_rol_user')->insert([
                    'content_id' => $request->content_id,
                    'user_id' => $user['id'],
                    'rol_id' => $user['rol_id'],                   
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
        try {
            $content = Content::where('slug', $slug)->firstOrFail();
            $actors = $content->usersWithRol(1)->get();
            $directors = $content->usersWithRol(2)->get();
            $productors = $content->usersWithRol(3)->get();
            $photo_directors = $content->usersWithRol(4)->get();
            $screenwriter = $content->usersWithRol(5)->get();
            $operators = $content->usersWithRol(6)->get();
            $sound_engineers = $content->usersWithRol(7)->get();
            $editors = $content->usersWithRol(8)->get();

            return response()->json([
                'success' => true,
                'data' => [
                    'actors' => $actors,
                    'directors' => $directors,
                    'productors' => $productors,
                    'photo_directors' => $photo_directors,
                    'screenwriter' => $screenwriter,
                    'operators' => $operators,
                    'sound_engineers' => $sound_engineers,
                    'editors' => $editors
                ],
                'message' => 'Usuarios con roles en el contenido obtenidos con éxito.'
            ],200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
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
    public function destroy(string $id)
    {
        //
    }
}
