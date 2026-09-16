import { useState, useEffect } from 'react';
import {Link} from 'react-router-dom';
import PostCard from '../components/Post/PostCard';
import CategoryList from '../components/Category/CategoryList';
import { postService } from '../services/postService';
import {categoryService} from '../services/categoryService';

export default function Home(){
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
       Promise.all([
        postService.getAll({pre_page: 6}),
        categoryService.getAll(),
       ])
       .then(([postRes, catRes]) => {
            setPosts(postRes.data ?? []);
            setCategories(catRes.data ?? []);
       })
       .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Добро пожаловать в блог</h1>

            {/* Категории сверху */}
            <aside className="mb-8">
                <h2 className="text-xl font-semibold mb-3">Категории</h2>
                <CategoryList categories={categories} />
            </aside>


            {/* Свежие посты */}
            <h2 className="text-2xl font-semibold mb-4">Свежее</h2>
            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
            )}

            <div className="mt-8">
                <Link to="/posts" className="text-blue-600 hover:underline">Все новости →</Link>
            </div>
        </div>
    );

}