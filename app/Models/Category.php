<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory; // <-- правильный путь к трейту
use Illuminate\Database\Eloquent\Relations\HasMany;
// если есть belongsTo, оставь и его
use Illuminate\Database\Eloquent\Relations\BelongsTo; 

class Category extends Model
{
    use HasFactory; // теперь это сработает

    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    public function children(): HasMany
    {
        return $this->hasMany(static::class, 'parent_id');
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(static::class, 'parent_id');
    }
}
