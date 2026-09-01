<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->word() . '-' . fake()->numberBetween(100, 9999),
            'slug' => fn (array $attributes) => Str::slug($attributes['name']),
            'description' => fake()->sentence(),
            'parent_id' => null,
        ];
    }

    // категория-родитель (для вложенности)
    public function parent(int $parentId): static
    {
        return $this->state(['parent_id' => $parentId]);
    }
}