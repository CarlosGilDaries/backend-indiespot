<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Content extends Model
{
        protected $fillable = [
        'title',
        'overview',
        'tagline',
        'trailer',
        'cover',
        'release_date',
        'vote_count',
        'vote_average',
        'type',
        'gender_id',
        'duration',
        'duration_type_name',
        'url',
        'slug',
    ];

    public function gender()
    {
        return $this->belongsTo(Gender::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'content_rol_user')
                   ->withPivot('rol_id');
    }

    public function categories()
    {
        return $this->belongsToMany(Category::class);
    }
}
