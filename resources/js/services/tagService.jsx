import api from './api';

export const tagService = {
    async getAll(params){
        return (await api.get('/tags', {params})).data;
    },

    async getById(id) {
        return (await api.get(`/tags/${id}`)).data;
    },
    async create(payload) {
        return (await api.post('/tags', payload)).data;
    },
    async update(id, payload) {
        return (await api.patch(`/tags/${id}`, payload)).data;
    },
    async remove(id) {
        return (await api.delete(`/tags/${id}`)).data;
    },
}