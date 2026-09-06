import { useState, useEffect } from 'react';
import PostList from '../components/Post/PostList';
import { postService } from '../services/postService';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
    const [loading, setLoading] = useState(true);

    const load = (page = 1) => {
        setLoading(true);
        postService.getAll({ page })
            .then(data => {
                setPosts(data.data);
                setMeta(data.meta);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => load(), []);   // первая загрузка

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-6">Новости</h1>
            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <PostList
                    posts={posts}
                    currentPage={meta.current_page}
                    lastPage={meta.last_page}
                    onPageChange={load}   // передаём функцию переключения страниц
                />
            )}
        </div>
    );
}
