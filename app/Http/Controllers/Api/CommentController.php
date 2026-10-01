<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentStoreRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function store(Post $post, CommentStoreRequest $request)
    {
        $validated = $request->validated();

        // post_id берём из привязанной модели маршрута, а user_id — из
        // авторизованного пользователя (маршрут защищён auth:sanctum).
        $comment = Comment::create([
            ...$validated,
            'post_id' => $post->id,
            'user_id' => $request->user()->id,
        ]);

        return new CommentResource($comment->load('user'));
    }

    public function destroy(Comment $comment)
    {
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(null, 204);
    }
}