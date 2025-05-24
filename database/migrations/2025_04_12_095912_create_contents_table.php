<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('contents', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('overview', 1000);
            $table->string('tagline', 500);
            $table->string('trailer')->nullable();
            $table->string('cover')->nullable();
            $table->date('release_date');
            $table->integer('vote_count');
            $table->decimal('vote_average', 5, 2); 
            $table->enum('type', ['video/mp4', 'application/vnd.apple.mpegurl']);
            $table->time('duration')->nullable();
            $table->enum('duration_type_name', ['cortometraje', 'mediometraje', 'largometraje']);
            $table->foreignId('gender_id')->constrained();
            $table->string('url');
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contents');
    }
};
