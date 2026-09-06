import api from './api';

export const authService = {
    async login(email, password) {
        const { data } = await api.post('/login', {
            email,
            password,
        });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    },

    async logout() {
        try {
            await api.post('/logout');
        } catch (e) {
            // игнорируем ошибку — даже если токен уже невалиден, чистим локальное хранилище
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getUser() {
        try {
            const raw = localStorage.getItem('user');
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    },
};
