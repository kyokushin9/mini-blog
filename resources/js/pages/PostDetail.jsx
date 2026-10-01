import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';
import { authService } from '../services/authService';

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [commentBody, setCommentBody] = useState('');
    const [refreshKey, setRefreshKey] = useState(0);
    const currentUser = authService.getUser();

    useEffect(() => {
        setLoading(true);
        postService.getById(id)
            .then(data => {
                const p = data.data ?? data;
                setPost(p);
                document.title = p.title;
                document.querySelector('meta[name="description"]')
                    ?.setAttribute('content', p.excerpt ?? '');
            })
            .catch(() => setError('Не удалось загрузить пост'))
            .finally(() => setLoading(false));

        categoryService.getAll()
            .then(res => setCategories(res.data ?? []))
            .catch(() => {});
    }, [id, refreshKey]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentBody.trim()) return;
        await postService.addComment(id, commentBody);
        setCommentBody('');
        setRefreshKey(k => k + 1);
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Удалить комментарий?')) return;
        await postService.deleteComment(commentId);
        setRefreshKey(k => k + 1);
    };

    if (loading) return <div className="p-8">Загрузка...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!post) return <div className="p-8">Пост не найден</div>;

    return (
        <div className="max-w-6xl mx-auto p-8 flex gap-8">
            <aside className="w-64 shrink-0">
                <h3 className="font-semibold mb-3">Категории</h3>
                <ul className="space-y-1">
                    {categories.map(cat => (
                        <li key={cat.id}>
                            <Link to={`/categories/${cat.id}`}
                                  className="text-gray-600 hover:text-blue-600 text-sm">
                                {cat.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </aside>

            <article className="flex-1">
                <p className="text-gray-400 text-sm">
                    {post.category && (
                        <Link to={`/categories/${post.category.id}`}
                              className="text-blue-600 hover:underline">
                            {post.category.name}
                        </Link>
                    )} - {post.author?.name} - {post.created_at}
                </p>
                <h1 className="text-4xl font-bold mt-2">{post.title}</h1>
                <p className="text-gray-500 mt-4 italic">{post.excerpt}</p>
                <div className="prose mt-6 leading-relaxed whitespace-pre-wrap">{post.content}</div>

                <section className="mt-10">
                    <h2 className="text-2xl font-bold mb-4">Комментарии ({(post.comments ?? []).length})</h2>

                    <ul className="space-y-4">
                        {(post.comments ?? []).map(c => (
                            <li key={c.id} className="border rounded p-3">
                                <p className="text-sm text-gray-500">{c.author?.name} · {c.created_at}</p>
                                <p>{c.body}</p>
                                {currentUser && (currentUser.role === 'admin' || c.author?.id === currentUser.id) && (
                                    <button onClick={() => handleDeleteComment(c.id)}
                                            className="text-red-600 text-sm">Удалить</button>
                                )}
                            </li>
                        ))}
                    </ul>

                    {currentUser ? (
                        <form onSubmit={handleCommentSubmit} className="mt-6">
                            <textarea value={commentBody} onChange={e => setCommentBody(e.target.value)}
                                      rows={3} className="w-full border rounded px-3 py-2"
                                      placeholder="Ваш комментарий..." required />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-2">Отправить</button>
                        </form>
                    ) : (
                        <p className="text-gray-500 mt-4">
                            Комментарии могут оставлять только авторизованные пользователи.
                        </p>
                    )}
                </section>

                <Link to="/posts" className="mt-6 inline-block">← Все новости</Link>
            </article>
        </div>
    );
}
