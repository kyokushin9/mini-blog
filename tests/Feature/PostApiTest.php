<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Http\Resources\PostCollection;
use Tests\TestCase;
use App\Models\Post;

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

    public function test_example()
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
    }

}
