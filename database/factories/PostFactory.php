<?php

namespace Database\Factories;

use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Post>
 */
class PostFactory extends Factory
{
   
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        
        $title = fake()->sentence(6);

        return [
            'title' => $title,
            'slug' => Str::slug($title),
            'content'=> fake()->paragraphs(5, true),
            'excerpt' => fake()->sentence(),
            'image' => fake() ->imageUrl(),
            'category_id' => fn () => (Category::inRandomOrder()->first() ?? Category::factory()->create())->id,
            'user_id' => fn () => (User::inRandomOrder()->first() ?? User::factory()->create())->id,
            'published_at' => fake()->dateTimeThisYear(),
        ];
    }

    public function published():static 
    {
        return $this->state(['published_at' => now()]);
    }

    public function draft(): static
    {
        return $this->state(['published_at' => null]);
    }
}
