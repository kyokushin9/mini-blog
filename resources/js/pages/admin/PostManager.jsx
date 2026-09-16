import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../../components/UI/Pagination';
import { postService } from '../../services/postService';


export default function PostManager() {
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });

    const load = (page = 1) => {
        postService.getAll({ page, per_page: 20 })
            .then(data => { setPosts(data.data); setMeta(data.meta); });
    };

    useEffect(() => {
        load();
    }, []);

    const handleDelete = async (post) => {
        if (!confirm(`Удалить пост «${post.title}»?`)) return;
        try {
            await postService.remove(post.id);
            load(meta.current_page);               // перезагружаем текущую страницу
        } catch (err) {
            alert('Не удалось удалить: ' + (err.response?.data?.message ?? 'ошибка'));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Посты</h2>
                <Link to="/posts/create" className="bg-blue-600 text-white px-4 py-2 rounded">+ Создать</Link>
            </div>

            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2 text-left">Заголовок</th>
                        <th className="p-2 text-left">Категория</th>
                        <th className="p-2 text-left">Автор</th>
                        <th className="p-2">Действия</th>
                    </tr>
                </thead>
                <tbody>
                    
                    {posts.map(post => (
                        <tr key={post.id} className="border-t">
                            <td className="p-2">{post.title}</td>
                            <td className="p-2">{post.category?.name}</td>
                            <td className="p-2">{post.author?.name}</td>
                            <td className="p-2 flex gap-2">
                                <Link to={`/posts/${post.id}/edit`}
                                      className="text-blue-600">Ред.</Link>
                                <button onClick={() => handleDelete(post)}
                                        className="text-red-600">Удал.</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Pagination currentPage={meta.current_page} lastPage={meta.last_page} onPageChange={load} />
        </div>
    );
}
