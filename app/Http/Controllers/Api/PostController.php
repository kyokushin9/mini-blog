<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Http\Requests\PostStoreRequest;
use App\Http\Requests\PostUpdateRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\PostCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {

        $posts = Cache::remember(
            'posts_' . md5(json_encode($request->all())), 
            3600, 
            function () use ($request) {
                $query = Post::with(['category', 'author']);

                if($request->has('search')) {
                    $query->where('title', 'like', '%' . $request->search . '%');
                }
                
                if($request->has('category_id')) {
                    $query->where('category_id', $request->category_id);
                }

                $sortBy = $request->get('sort_by','created_at');
                $order = $request->get('order', 'desc');
                $query->orderBy($sortBy,$order);

                return $query->paginate($request->get('per_page', 15));
            }
        );


        
        
        return new PostCollection($posts);

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PostStoreRequest $request)
    {

        $this->authorize('create', Post::class);
        
        $validated = $request->validated();

        $post = Post::create($validated);

        return new PostResource($post);

    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        
        $post->load(['category', 'author', 'tags']);

        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PostUpdateRequest $request, Post $post)
    {

        $this->authorize('update', Post::class);

        $validated = $request->validated();

        $post ->update($validated);

        return new PostResource($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {

        $this->authorize('delete', Post::class);

        $post->delete();

        return response()->json(null, 204);
    }
}
