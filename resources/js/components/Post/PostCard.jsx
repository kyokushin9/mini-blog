import { Link } from 'react-router-dom';

export default function PostCard({ post }){
    return (
        <article className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <Link to={`/posts/${post.id}`}>
            <h2 className="text-x1 font-semibold hover:text-blue-600">{post.title}</h2>
            </Link>
            <p className="text-gray-500 text-sm mt-1">{post.excerpt}</p>
            <p className="text-gray-500 text-sm mt-2">{post.category?.name}</p>
        </article>
    )
}