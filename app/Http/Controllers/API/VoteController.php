<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Content;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class VoteController extends Controller
{
    public function store($slug, Request $request)
    {
        try {
            $user = Auth::user();
            $content = Content::where('slug', $slug)->first();
            $existingVote = DB::table('votes')
                ->where('user_id', $user->id)
                ->where('content_id', $content->id)
                ->first();
            
            if ($existingVote) {
                DB::table('votes')
                    ->where('user_id', $user->id)
                    ->where('content_id', $content->id)
                    ->update([
                        'vote' => $request->vote,                
                        'updated_at' => now(),
                    ]);

                $total = DB::table('votes')
                ->where('content_id', $content->id)
                ->sum('vote');

                $average = $total/$content->vote_count;

                DB::table('contents')
                    ->where('id', $content->id)
                    ->update([
                        'vote_average' => $average,                
                        'updated_at' => now(),
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Voto actualizado con éxito.'
                ], 201);
            }

            DB::table('votes')->insert([
                'vote' => $request->vote,
                'content_id' => $content->id,
                'user_id' => $user->id,                 
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $total = DB::table('votes')
                ->where('content_id', $content->id)
                ->sum('vote');

            $voteCount = $content->vote_count + 1;
            $average = $total/$voteCount;

            DB::table('contents')
                ->where('id', $content->id)
                ->update([
                    'vote_count' => $content->vote_count + 1,
                    'vote_average' => $average,                
                    'updated_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Voto creado con éxito.'
            ], 201);

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
    public function show($slug)
    {
        try {
            $user = Auth::user();
            $content = Content::where('slug', $slug)->first();
            $vote = DB::table('votes')
                ->where('content_id', $content->id)
                ->where('user_id', $user->id)
                ->first();

            if (!$vote) {
                return response()->json([
                    'success' => true,
                    'vote' => null,
                    'message' => 'Todavía no has votado este contenido.'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'vote' => $vote,
                'message' => 'Voto recibido con éxito.'

            ], 201);


        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
