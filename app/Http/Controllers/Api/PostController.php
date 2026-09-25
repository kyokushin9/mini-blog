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
        $query = Post::with(['category', 'author', 'tags']);

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        $sortBy = $request->get('sort_by', 'created_at');
        $order  = $request->get('order', 'desc');
        $query->orderBy($sortBy, $order);

        return new PostCollection($query->paginate($request->get('per_page', 15)));
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(PostStoreRequest $request)
    {

        $this->authorize('create', Post::class);
        
        $validated = $request->validated();

        if($request->hasFile('image')) {
            $path = $request->file('image')->store('posts');
            $validated['image'] = $path;
        }

        $post = Post::create($validated);

        if($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        $post->load('tags'); 

        return new PostResource($post);

    }

    /**
     * Display the specified resource.
     */
    public function show(Post $post)
    {
        
        $post->load(['category', 'author', 'tags', 'comments.user']); //tags

        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(PostUpdateRequest $request, Post $post)
    {

        $this->authorize('update', $post); //Post::class);

        $validated = $request->validated();

        $post->update($validated);

        if($request->has('tags')) {
            $post->tags()->sync($request->tags);
        }

        return new PostResource($post);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Post $post)
    {

        $this->authorize('delete', $post); //Post::class);

        $post->delete();

        return response()->json(null, 204);
    }
}
