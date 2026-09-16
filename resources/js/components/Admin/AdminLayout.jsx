import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
    return (
        <div className="max-w-6xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">Админ-панель</h1>
            <nav className="flex gap-6 mb-8 border-b pb-4">
                <Link to="/admin" className="hover:text-blue-600">Дашборд</Link>
                <Link to="/admin/posts" className="hover:text-blue-600">Посты</Link>
                <Link to="/admin/categories" className="hover:text-blue-600">Категории</Link>
            </nav>
            <Outlet />
        </div>
    );
}