import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';   // ← добавили импорт

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [categories, setCategories] = useState([]);      // ← стейт для всех категорий
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        postService.getById(id)
            .then(data => setPost(data.data ?? data))
            .catch(() => setError('Не удалось загрузить пост'))
            .finally(() => setLoading(false));

        // ← ВТОРОЙ запрос: грузим все категории (независимо от поста)
        categoryService.getAll()
            .then(res => setCategories(res.data ?? []))    // CategoryCollection отдаёт { data: [...], meta } — см. ниже
            .catch(() => {});                              // не критично для страницы — молча игнорируем
    }, [id]);

    if (loading) return <div className="p-8">Загрузка...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!post) return <div className="p-8">Пост не найден</div>;

    return (
        <div className="max-w-6xl mx-auto p-8 flex gap-8">
            {/* Сайдбар: все категории */}
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

            {/* Пост */}
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
                <Link to="/posts" className="mt-6 inline-block">← Все новости</Link>
            </article>
        </div>
    );
}
