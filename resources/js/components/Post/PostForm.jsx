import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from '../UI/Input';
import Button from "../UI/Button";
import { postService } from "../../services/postService";
import { categoryService } from '../../services/categoryService';
import { tagService } from '../../services/tagService';
import api from '../../services/api';


export default function PostForm() {
    const {id} = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({title: '', content: '', category_id: '', excerpt: '' });
    const [submitting, setSubmitting] = useState(false);

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [formTags, setFormTags] = useState([]);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        categoryService.getAll().then(res => setCategories(res.data ?? []));
        tagService.getAll().then(res => setTags(res.data ?? []));
        if(isEdit) {
            postService.getById(id).then(({data}) => {
                setForm({
                    title: data.title,
                    content: data.content,
                    category_id: data.category_id ?? '',
                    excerpt: data.excerpt ?? '',
                });

                setFormTags((data.tags ?? []).map(t => t.id));
            });
        }
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try{

            if(imageFile) {

                const fd = new FormData();
                fd.append('title', form.title);
                fd.append('excerpt', form.excerpt);
                fd.append('content', form.content);
                fd.append('category_id', form.category_id);
                fd.append('tags', JSON.stringify(formTags));
                fd.append('image', imageFile);

                if(isEdit) {
                    await api.put(`/posts/${id}`, fd);
                } else {
                    await api.post('/posts', fd);
                }

            } else {

                const payload = { ...form, tags: formTags };

                if(isEdit) {
                    await postService.update(id, payload);
                } else {
                    await postService.create(payload);
                }

            }

            
            navigate(isEdit? `/posts/${id}` : '/posts');
        } catch (err) {
            console.error(err);
            alert('Ошибка сохранения');
        } finally {
            setSubmitting(false);
        }
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleTagToggle = (tagId) => {
        if(formTags.includes(tagId)) {
            setFormTags(formTags.filter(id => id !== tagId));
        } else {
            setFormTags([...formTags, tagId]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 space-y-4">
            <Input label="Заголовок" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Аннотация (excerpt)" name="excerpt" value={form.excerpt} onChange={handleChange} />
            <label className="block">
                <span>Изображение</span>
                <input type="file" accept="image/*"
                    onChange={e => setImageFile(e.target.files[0])}
                    className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <label className="block">
                <span>Категория</span>
                <select name="category_id" value={form.category_id} onChange={handleChange}
                        className="mt-1 w-full border rounded px-3 py-2">
                    <option value="">— выберите —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </label>
            <label className="block">
                <span>Текст</span>
                <textarea name="content" value={form.content} onChange={handleChange} required rows={10}
                          className="mt-1 w-full border rounded px-3 py-2" />
            </label>
            <fieldset className="block border p-3 rounded">
                <legend>Теги</legend>
                {tags.length === 0 ? (
                    <p className="text-sm text-gray-500">Теги пока не созданы</p>
                ) : (
                    tags.map(tag => (
                        <label key={tag.id} className="inline-flex items-center gap-2 mr-3">
                            <input 
                                type="checkbox"
                                checked={formTags.includes(tag.id)}
                                onChange={() => handleTagToggle(tag.id)}
                                className="accent-blue-600"
                            />
                            <span>{tag.name}</span>
                        </label>
                    ))
                )}
            </fieldset>
            <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Создать')}
            </Button>
        </form>
    );

}