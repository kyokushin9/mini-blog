import api from './api';

export const categoryService = {
    async getAll(params){
        return (await api.get('/categories', {params})).data;
    },

    async getById(id) {
        return (await api.get(`/posts/${id}`)).data;
    },
    async create(payload) {
        return (await api.post('/categories', payload)).data;
    },
    async update(id, payload) {
        return (await api.patch(`/categories/${id}`, payload)).data;
    },
    async remove(id) {
        return (await api.delete(`/categories/${id}`)).data;
    },
}