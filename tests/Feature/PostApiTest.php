<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Support\Str;


class PostApiTest extends TestCase
{
    /**
     * A basic feature test example.
     */
   /* public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }*/

   /* public function test_example()
    {
        Post::factory()->count(10)->create();
        
        $response = $this->getJson('/api/posts');
        
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => ['id', 'title', 'slug', 'content']
                    ],
                    'meta' => ['total', 'count', 'per_page']
                ]);
    }*/
    public function test_it_lists_posts(): void 
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Post::factory()->count(15)->create([
            'user_id' => $user->id,
            'category_id' => $category->id,
        ]);

        $response = $this->getJson('/api/posts');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 15)
            ->assertJsonPath('meta.per_page', 15);
    }

    public function test_it_shows_a_post(): void 
    {
        $post = Post::factory()->create();

        $response = $this->getJson("/api/posts/{$post->id}");

        $response->assertStatus(200)
            ->assertJsonPath('data.id', $post->id)
            ->assertJsonPath('data.title', $post->title);
    }

    public function test_it_lists_posts_with_pagination(): void
    {
        Post::factory()->count(15)->create();

        $response = $this->getJson('/api/posts?page=2&per_page=15');

        $response->assertStatus(200)
            ->assertJsonPath('meta.current_page', 2)
            ->assertJsonPath('meta.total', 15);
    }

    public function test_it_searches_posts_by_title(): void 
    {
        Post::factory()->create(['title' => 'Unique Searching Word']);
        Post::factory()->count(5)->create();

        $response = $this->getJson('/api/posts?search=Searching');

        $response->assertStatus(200)
            ->assertJsonPath('meta.total', 1);
    }

    public function test_it_filters_posts_by_category():void
    {
        $category = Category::factory()->create();
        $otherCategory = Category::factory()->create();

        Post::factory()->count(3)->create(['category_id' => $category->id]);
        Post::factory()->count(2)->create(['category_id' => $otherCategory->id]);

        $response = $this->getJson('/api/posts?category_id=' . $category->id);

        $response->assertStatus(200)
           ->assertJsonPath('meta.total', 3);
    }

    public function test_guest_cannot_create_post(): void
    {
        $response = $this->postJson('/api/posts', ['title' => 'X', 'content' => 'Y']);

        $response->assertStatus(401);
    }

    public function test_author_can_create_post(): void
    {
        $user = User::factory()->create(['role' => 'author']);
        $token = $user->createToken('test')->plainTextToken;
        $category = Category::factory()->create();

        $response = $this->withToken($token)->postJson('/api/posts', [
            'title'=> "New Title " . Str::random(6),
            'content'=>'Some content',
            'category_id'=> $category->id,
        ]);

        $response->assertStatus(201);
    }

    public function test_store_requires_title(): void
    {
        $user = User::factory()->create(['role' => 'author']);
        $token = $user->createToken('test')->plainTextToken;
        
        $response = $this->withToken($token)->postJson('/api/posts', ['content' => 'No title']);

        $response->assertStatus(422);
    }

}
