import { useState, useEffect } from 'react';
import { postService } from '../services/postService';

export default function Home(){
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        postService.getAll().then(data => setPosts(data.data ?? []));
    }, []);

    return (
        <div>
            <h1>Блог</h1>
            {posts.map(p => (
                <article key={p.id}>
                    <h2>{p.title}</h2>
                </article>
            ))}
        </div>
    );

}