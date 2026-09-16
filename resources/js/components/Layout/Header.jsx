import {Link} from 'react-router-dom';
import {authService} from '../../services/authService';

export default function Header() {
    const user = authService.getUser();

    const handleLogout = () => {
        authService.logout();
        window.location.reload();
    }

    return (
        <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
            <nav className="flex gap-4">
                <Link to="/" className="hover:text-gray-300">Главная</Link>
                <Link to="/posts" className="hover:text-gray-300">Новости</Link>
            </nav>
            <div className="flex items-center gap-3">
                {user ? (
                    <>
                        <span>{user.name} ({user.role})</span>
                        <button onClick={handleLogout} className="text-sm hover:text-gray-300">Выйти</button>
                    </>
                ) : (
                    <Link to="/login" className="hover:text-gray-300">Войти</Link>
                )}
            </div>
        </header>
    );
}