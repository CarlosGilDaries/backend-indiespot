<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gender extends Model
{
    protected $fillable = [
        'name'
    ];

    public function contents()
    {
        return $this->hasMany(Content::class);
    }
}
