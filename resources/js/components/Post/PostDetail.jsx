import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { postService } from '../../services/postService';

export default function PostDetail(){
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        postService.getById(id)
            .then(data => setData(data.data)
            .catch(err => setError('Неудалось загрузить пост'))
            .finally(() => setLoading(false));
    }, [id]);

    if(loading) return (<div className="p-8">Загрузка...</div>);
    if(error){ return (<div className="p-8 text-red-600">{error}</div>);
    if(!post){ return (<div className="p-8">Пост не найден</div>);

    
    return (
        <article className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-gray-500 mt-1">{post.category?.name} · {post.author?.name}</p>
            <div className="mt-6 leading-relaxed">{post.content}</div>
        </article>
    );

}