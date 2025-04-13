<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $roles = Role::all();

            return response()->json([
                'success' => true,
                'roles' => $roles,
                'message' => 'Roles obtenidos con éxito.'
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
        /*
        INSERT INTO `roles` (`id`, `name`, `created_at`, `updated_at`) VALUES
            (1, 'Actor/Actriz', NOW(), NOW()),
            (2, 'Director/a', NOW(), NOW()),
            (3, 'Productor/a', NOW(), NOW()),
            (4, 'Director/a de Fotografía', NOW(), NOW()),
            (5, 'Guionista', NOW(), NOW()),
            (6, 'Operador/a de cámara/luces/equipos', NOW(), NOW()),
            (7, 'Ingeniero/a de Sonido', NOW(), NOW()),
            (8, 'Editor/a', NOW(), NOW());
        */
    }

    /**
     * Display the specified resource.
     */
    public function show(Role $role)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Role $role)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Role $role)
    {
        //
    }
}
