import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from '../UI/Input';
import Button from "../UI/Button";
import { postService } from "../../services/postService";
import { categoryService } from '../../services/categoryService';

export default function PostForm() {
    const {id} = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({title: '', content: '', category_id: '', excerpt: '' });
    const [submitting, setSubmitting] = useState(false);

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        categoryService.getAll().then(res => setCategories(res.data ?? []));
        if(isEdit) {
            postService.getById(id).then(({data}) => {
                setForm({
                    title: data.title,
                    content: data.content,
                    category_id: data.category_id ?? '',
                    excerpt: data.excerpt ?? '',
                });
            });
        }
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try{
            if(isEdit) {
                await postService.update(id, form);
            } else {
                await postService.create(form);
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

     return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-8 space-y-4">
            <Input label="Заголовок" name="title" value={form.title} onChange={handleChange} required />
            <Input label="Аннотация (excerpt)" name="excerpt" value={form.excerpt} onChange={handleChange} />
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
            <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Сохранение...' : (isEdit ? 'Сохранить' : 'Создать')}
            </Button>
        </form>
    );

}