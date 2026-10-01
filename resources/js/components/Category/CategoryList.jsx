import { Link } from 'react-router-dom';

export default function CategoryList({ categories }) {
    return (
        <ul className="space-y-1">
            {(categories ?? []).map(cat => <CategoryItem key={cat.id} cat={cat} />)}
        </ul>
    );
}

function CategoryItem({ cat }) {
    return (
        <li>
            <Link to={`/categories/${cat.id}`} className="text-sm text-gray-600 hover:text-blue-600">
                {cat.name}
            </Link>
            {cat.children?.length > 0 && (
                <ul className="ml-4">
                    {cat.children.map(child => <CategoryItem key={child.id} cat={child} />)}
                </ul>
            )}
        </li>
    );
}