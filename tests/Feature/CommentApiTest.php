<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use App\Models\Comment;
use App\Models\Post;
use App\Models\User;
use Tests\TestCase;

class CommentApiTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_quest_cannot_comment(): void
    {
        $post = Post::factory()->create();

        $this->postJson("/api/posts/{$post->id}/comments", ['body' => 'x'])
            ->assertStatus(401);
    }

    public function test_user_can_comment(): void
    {

        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $post = Post::factory()->create();

        $this->withToken($token)
            ->postJson("/api/posts/{$post->id}/comments", ['body' => 'Отличный пост!'])
            ->assertStatus(201);
    
    }

    public function test_comment_author_can_delete(): void 
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;
        $post = Post::factory()->create();
        $comment = Comment::factory()->create(['post_id' => $post->id, 'user_id' => $user->id]);

        $this->withToken($token)
            ->deleteJson("/api/comments/{$comment->id}")
            ->assertStatus(204);

    }

    public function test_other_user_cannot_delete(): void 
    {
        $author = User::factory()->create();
        $other = User::factory()->create();
        $otherToken = $other->createToken('test')->plainTextToken;
        $post = Post::factory()->create();
        $comment = Comment::factory()->create(['post_id' => $post->id, 'user_id' => $author->id]);

        $this->withToken($otherToken)
            ->deleteJson("/api/comments/{$comment->id}")
            ->assertStatus(403);

    }

}
