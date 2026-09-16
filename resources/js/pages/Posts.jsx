import { useState, useEffect } from 'react';
import PostList from '../components/Post/PostList';
import { postService } from '../services/postService';
import { categoryService } from '../services/categoryService';


export default function Posts() {
    const [filters, setFilters] = useState({ search: '', category_id: ''});
    const [posts, setPosts] = useState([]);
    const [meta, setMeta] = useState({ current_page: 1, last_page: 1 });
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    

    const load = (page = 1) => {
        setLoading(true);
        postService.getAll({ page, ...filters })
            .then(data => {
                console.log('Отловили данные:', data);   // ← временно: увидишь, что вернулось
                setPosts(data.data ?? []);
                setMeta(data.meta);
            })
            .catch(err => {
                console.error('Ошибка загрузки постов:', err);
            })
            .finally(() => setLoading(false));
    };



    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value});
    }

    useEffect(() => {
        load(1);
    }, [filters.search, filters.category_id]);   // первая загрузка

    useEffect(() => {
        categoryService.getAll()
            .then(res => setCategories(res.data ?? []))
            .catch(() => {});   // не критично: если не загрузилось — просто пустой фильтр
    }, []);

    return (
        <div className="p-8">
            <div className="mb-6 flex gap-4">
                <input
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Поиск по заголовку..."
                    className="flex-1 border rounded px-3 py-2"
                />
                <select name="category_id" value={filters.category_id} onChange={handleFilterChange}
                        className="border rounded px-3 py-2">
                    <option value="">Все категории</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
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
