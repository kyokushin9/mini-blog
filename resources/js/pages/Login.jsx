import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/UI/Input';
import Button from '../components/UI/Button';
import { authService } from '../services/authService';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login(email, password);   // токен сохранится в localStorage (внутри сервиса)
            navigate('/');                              // → на главную
        } catch (err) {
            setError('Неверный email или пароль');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-16 space-y-4">
            <h1 className="text-2xl">Вход</h1>
            {error && <div className="bg-red-100 text-red-700 p-2 rounded">{error}</div>}
            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <Input label="Пароль" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            <Button type="submit" variant="primary">Войти</Button>
        </form>
    );
}
