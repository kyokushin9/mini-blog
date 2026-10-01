<?php

use Illuminate\Support\Facades\Route;

Route::get('/rss', function () {
    $posts = \App\Models\Post::with('category')
        ->whereNotNull('published_at')
        ->orderByDesc('published_at')
        ->take(20)
        ->get();

    $items = '';
    foreach ($posts as $post) {
        $items .= "<item>"
            . "<title>" . e($post->title) . "</title>"
            . "<link>" . url('/posts/' . $post->id) . "</link>"
            . "<description>" . e($post->excerpt ?? $post->content) . "</description>"
            . "<pubDate>" . $post->published_at->format('r') . "</pubDate>"
            . "</item>";
    }

    $xml = '<?xml version="1.0" encoding="UTF-8"?>'
        . '<rss version="2.0"><channel>'
        . '<title>Мой блог</title><description>Свежие статьи</description>'
        . $items
        . '</channel></rss>';

    return response($xml)->withHeader('Content-Type', 'application/rss+xml; charset=utf-8');
});


Route::get('/sitemap.xml', function(){
    $posts = \App\Models\Post::whereNotNull('published_at')->orderByDesc('published_at')->get();

    $urls = "<url><loc>" . url('/') . "</loc></url>";
    foreach($posts as $post) {
        $urls .= "<url><loc>" . url('/posts/' . $post->id) . "</loc>"
        . "<lastmod>" . $post->updated_at->format('Y-m-d') . "</lastmod></url>";
    }

    $xml = '<?xml version="1.0" encoding="UTF-8"?>'
        . '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        . $urls . '</urlset>';
    return response($xml)->withHeader('Content-Type', 'application/xml; charset=utf-8');
});


Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
