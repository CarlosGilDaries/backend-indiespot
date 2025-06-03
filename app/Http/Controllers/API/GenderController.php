<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Gender;
//use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use DataTables;

class GenderController extends Controller
{
        public function index()
    {
        try {
        $genders = Gender::all();

        return response()->json([
            'success' => true,
            'genders' => $genders,
            'message' => 'Géneros obtenidos con éxito.',
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
            $genders = Gender::all();

			return DataTables::of($genders)
				->addColumn('id', function($gender) {
					return $gender->id;
				})
				->addColumn('name', function($gender) {
					return $gender->name;
				})
				->addColumn('actions', function($gender) {
					return $this->getActionButtons($gender);
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
            $gender = Gender::with('contents.gender')->where('id', $id)->first();
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

    private function getActionButtons($gender)
	{
		$id = $gender->id;

		return '
			<div class="actions-container">
				<button class="actions-button orders-button">Acciones</button>
				<div class="actions-menu">
					<a href="/admin/edit-gender.html" class="action-item content-action edit-button" data-id="'.$id.'">Editar</a>
                    <form class="gender-delete-form" data-id="' . $id . '">
						<input type="hidden" name="content_id" value="' . $id . '">
						<button class="action-item content-action delete-btn" type="submit">Eliminar</button>
					</form>
				</div>
			</div>';
	}
}
