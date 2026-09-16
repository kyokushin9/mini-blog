import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import PostList from '../components/Post/PostList';
import {postService} from '../services/postService';
import {categoryService} from '../services/categoryService';

export default function CategoryDetail(){
    const {id} = useState();
    const [posts,setPosts] = useState([]);
    const [category, setCategory] = useState(null);
    const [meta,setMeta] = useState({ current_page: 1, last_page: 1 });
    const [loading, setLoading] = useState(true);

    const load = (page = 1) => {
        setLoading(true);
        postService.getAll({category_id: id,page})
            .then(data => {
                setPosts(data.data);
                setMeta(data.meta);
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        load();
        categoryService.getById(id)
            .then(data => setCategory(data.data ?? data))
            .catch(() => setCategory(null));
    }, [id]);

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-1">{category?.name ?? 'Категория'}</h1>
            {category?.descriptio && (
                <p className="text-gray-500 mb-6">{category.description}</p>
            )}
            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <PostList
                    posts={posts}
                    currentPage={meta.current_page}
                    lastPage={meta.last_page}
                    onPageChange={load}
                />
            )}
        </div>
    );

}