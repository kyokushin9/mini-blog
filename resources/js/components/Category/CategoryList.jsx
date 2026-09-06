import { Link } from 'react-router-dom';

export default function CategoryList({ categories }) {
    return (
        <ul className="space-y-1">
            {categories.map(cat => (
                <li key={cat.id}>
                    <Link to={`/categories/${cat.id}`} className="text-sm text-gray-600 hover:text-blue-600">
                        {cat.name} <span className="text-gray-400">({cat.posts_count ?? 0})</span>
                    </Link>
                    {cat.children?.length > 0 && (
                        <ul className="ml-4">
                            {cat.children.map(child => (
                                <li key={child.id}>
                                    <Link to={`/categories/${child.id}`}>{child.name}</Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            ))}
        </ul>
    );
}