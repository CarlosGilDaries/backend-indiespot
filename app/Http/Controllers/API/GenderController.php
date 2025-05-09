<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Gender;
//use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GenderController extends Controller
{
        public function index()
    {
        try {
        $genders = Gender::all();

        return response()->json([
            'success' => true,
            'genders' => $genders,
            'message' => 'Planes obtenidos con éxito.',
        ], 200);

        } catch (\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $gender = new Gender();
            $name = $request->input('name');

            $gender->name = $name;
            $gender->save();

            return response()->json([
                'success' => true,
                'gender' => $gender,
                'message' => 'Género creado con éxito'
            ], 200);

        } catch(\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $gender = Gender::where('id', $id)->first();
            Log::debug('id: ' . $id);

            return response()->json([
                'success' => true,
                'gender' => $gender,
                'message' => 'Género obtenido con éxito.'
            ]);

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
        try {
            $gender = Gender::where('id', $id)->first();
            $name = $request->input('name');

            $gender->name = $name;
            $gender->save();

            return response()->json([
                'success' => true,
                'gender' => $gender,
                'message' => 'Género editado con éxito'
            ], 200);

        } catch(\Exception $e) {
            Log::error('Error: ' . $e->getMessage());

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
            $gender = Gender::where('id', $id)->first();
            $gender->delete();

            return response()->json([
                'success' => true,
                'message' => 'Género eliminado con éxito'
            ], 200);

        } catch(\Exception $e) {
            Log::error('Error al eliminar el género: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }
}
