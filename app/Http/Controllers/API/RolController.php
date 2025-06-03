<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use DataTables;

class RolController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $rols = Rol::all();

            return response()->json([
                'success' => true,
                'rols' => $rols,
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

    public function datatable()
    {
        try {
            $rols = Rol::all();

			return DataTables::of($rols)
				->addColumn('id', function($rol) {
					return $rol->id;
				})
				->addColumn('name', function($rol) {
					return $rol->name;
				})
				->addColumn('actions', function($rol) {
					return $this->getActionButtons($rol);
				})
				->rawColumns(['actions'])
				->make(true);

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
            $rol = new Rol();
            $name = $request->input('name');

            $rol->name = $name;
            $rol->save();

            return response()->json([
                'success' => true,
                'rol' => $rol,
                'message' => 'Rol creado con éxito'
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
            $rol = Rol::where('id', $id)->first();

            return response()->json([
                'success' => true,
                'rol' => $rol,
                'message' => 'Rol obtenido con éxito.'
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
            $rol = Rol::where('id', $id)->first();
            $name = $request->input('name');

            $rol->name = $name;
            $rol->save();

            return response()->json([
                'success' => true,
                'gender' => $rol,
                'message' => 'Rol editado con éxito'
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
            $rol = Rol::where('id', $id)->first();
            $rol->delete();

            return response()->json([
                'success' => true,
                'message' => 'Rol eliminado con éxito'
            ], 200);

        } catch(\Exception $e) {
            Log::error('Error al eliminar el rol: ' . $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500);
        }
    }

    private function getActionButtons($rol)
	{
		$id = $rol->id;

		return '
			<div class="actions-container">
				<button class="actions-button orders-button">Acciones</button>
				<div class="actions-menu">
					<a href="/admin/edit-rol.html" 
                    class="action-item content-action edit-button" data-id="'.$id.'">Editar</a>
                    <form class="rol-delete-form" data-id="' . $id . '">
						<input type="hidden" name="content_id" value="' . $id . '">
						<button class="action-item delete-btn" type="submit">Eliminar</button>
					</form>
				</div>
			</div>';
	}
}
