import api from './api';

export const postService = {
    async getAll(params){
        return (await api.get('/posts', {params})).data;
    },

    async getById(id) {
        return (await api.get(`/posts/${id}`)).data;
    },
    async create(payload) {
        return (await api.post('/posts', payload)).data;
    },
    async update(id, payload) {
        return (await api.patch(`/posts/${id}`, payload)).data;
    },
    async remove(id) {
        return (await api.delete(`/posts/${id}`)).data;
    },
    async addComment(postId, body) {
        return (await api.post(`/posts/${postId}/comments`, { body })).data;
    },
    async deleteComment(commentId) {
        return (await api.delete(`/comments/${commentId}`)).data;
    },
}
