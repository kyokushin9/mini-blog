import api from './api';

export const authService = {
    async login(email, password) {
        const {data} = await api.post('/login', {
            email,
            password,
        })
        localStorage.setItem('token', data.token);
        localStorage.getItem('user', JSON.stringify(data.user));
        return data;
    },
    async logout() {
        try { await api.post('/logout');} catch (e){}
        localStorag.removeItem('token');
        localStorage.removeItem('user');    
        
    },
    getUser() {
        const raw = localStoage.getItem("user");
        return raw ? JSON.parse(raw): null;
    }
}