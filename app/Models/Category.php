<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    protected $fillable = [
        'name',        
        'priority',
        'render_at_index'
    ]; 

    public function contents()
    {
        return $this->belongsToMany(Content::class);
    }
}
