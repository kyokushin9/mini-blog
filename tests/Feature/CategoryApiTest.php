<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use Illuminate\Support\Str;

class CategoryApiTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    /*public function test_example(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }*/

    public function test_it_lists_categories_with_children(): void 
    {
        $parent = Category::factory()->create();
        $child = Category::factory()->create(['parent_id' => $parent->id]);

        $response = $this->getJson('/api/categories');

        $response->assertStatus(200)
            ->assertJsonPath('data.0.id', $parent->id)
            ->assertJsonPath('data.0.children.0.id', $child->id);
    }

    public function test_author_cannot_create_category(): void 
    {
        $user = User::factory()->create(['role' => 'author']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/categories', ['name' => 'X']);

        $response->assertStatus(403);
    }

    public function test_admin_can_create_category(): void 
    {
        $user = User::factory()->create(['role' => 'admin']);
        $token = $user->createToken('test')->plainTextToken;

        $response = $this->withToken($token)->postJson('/api/categories', ['name' => 'Newss']);
        $response->assertStatus(201);
    }

}
