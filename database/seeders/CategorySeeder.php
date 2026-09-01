<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        // Создаём корневые категории
        $rootCategories = Category::factory()->count(5)->create();

        // Для каждой корневой создаём 2–3 дочерних
        foreach ($rootCategories as $root) {
            Category::factory()
                ->count(3)
                ->parent($root->id)
                ->create();
        }
    }
}