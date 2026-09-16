import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';


export default function CategoryManager() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Состояние формы (и для create, и для edit)
    const [form, setForm] = useState({ name: '', slug: '', description: '', parent_id: '' });
    const [editingId, setEditingId] = useState(null);   // null = создание, число = редактирование

    // Загружаем список категорий при открытии страницы
    useEffect(() => {
        categoryService.getAll()
            .then(data => setCategories(data.data ?? []))
            .catch(() => setError('Не удалось загрузить категории'))
            .finally(() => setLoading(false));
    }, []);

    // Универсальный обработчик для всех полей формы
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Сброс формы в исходное состояние (после сохранения/отмены)
    const resetForm = () => {
        setForm({ name: '', slug: '', description: '', parent_id: '' });
        setEditingId(null);
    };

    // Отправка формы (создание или обновление)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await categoryService.update(editingId, form);
            } else {
                await categoryService.create(form);
            }
            resetForm();                       // очищаем форму
            await categoryService.getAll().then(data => setCategories(data.data ?? []));  // обновляем список
        } catch (err) {
            alert('Ошибка сохранения: ' + (err.response?.data?.message ?? 'что-то пошло не так'));
        }
    };

    // Редактирование: заполняем форму данными выбранной категории
    const handleEdit = (cat) => {
        setEditingId(cat.id);
        setForm({
            name: cat.name,
            slug: cat.slug ?? '',
            description: cat.description ?? '',
            parent_id: cat.parent_id ? String(cat.parent_id) : '',
        });
    };

    // Удаление с подтверждением
    const handleDelete = async (cat) => {
        if (!confirm(`Удалить категорию «${cat.name}»?`)) return;
        try {
            await categoryService.remove(cat.id);
            await categoryService.getAll().then(data => setCategories(data.data ?? []));
        } catch (err) {
            alert('Не удалось удалить: ' + (err.response?.data?.message ?? 'ошибка'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-8">
            {/* Заголовок */}
            <h2 className="text-2xl font-semibold mb-6">Категории</h2>

            {/* Ошибка загрузки */}
            {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}

            {/* Форма создания/редактирования */}
            <form onSubmit={handleSubmit} className="bg-gray-50 border rounded p-4 mb-8 space-y-3">
                <h3 className="font-semibold">{editingId ? 'Редактировать категорию' : 'Создать категорию'}</h3>

                <div className="grid grid-cols-2 gap-4">
                    <label>
                        <span className="text-sm text-gray-600">Название *</span>
                        <input
                            name="name" value={form.name} onChange={handleChange} required
                            className="mt-1 w-full border rounded px-3 py-2"
                            placeholder="Например: Новости"
                        />
                    </label>

                    <label>
                        <span className="text-sm text-gray-600">Slug</span>
                        <input
                            name="slug" value={form.slug} onChange={handleChange}
                            className="mt-1 w-full border rounded px-3 py-2"
                            placeholder="напр.: novosti"
                        />
                    </label>
                </div>

                {/* Родительская категория (для вложенности) */}
                <label>
                    <span className="text-sm text-gray-600">Родительская категория</span>
                    <select name="parent_id" value={form.parent_id} onChange={handleChange}
                            className="mt-1 w-full border rounded px-3 py-2">
                        <option value="">— корневая (без родителя) —</option>
                        {categories
                            .filter(c => c.id?.toString() !== editingId?.toString())  // нельзя поставить себя родителем
                            .map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                    </select>
                </label>

                <label>
                    <span className="text-sm text-gray-600">Описание</span>
                    <textarea name="description" value={form.description} onChange={handleChange} rows={2}
                              className="mt-1 w-full border rounded px-3 py-2" />
                </label>

                <div className="flex gap-3">
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                        {editingId ? 'Сохранить изменения' : 'Создать'}
                    </button>
                    {editingId && (
                        <button type="button" onClick={resetForm} className="bg-gray-200 px-4 py-2 rounded">
                            Отменить
                        </button>
                    )}
                </div>
            </form>

            {/* Список категорий */}
            {loading ? (
                <div>Загрузка...</div>
            ) : (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">Название</th>
                            <th className="p-2 text-left">Slug</th>
                            <th className="p-2 text-left">Родитель</th>
                            <th className="p-2 text-left">Постов</th>
                            <th className="p-2">Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => <CategoryRow key={cat.id} cat={cat} depth={0} onEdit={handleEdit} onDelete={handleDelete} />)}
                    </tbody>

                </table>
            )}
        </div>
    );
}


function CategoryRow({ cat, depth, onEdit, onDelete }) {
    return (
        <>
            <tr className="border-t">
                <td className="p-2 font-medium" style={{ paddingLeft: depth * 16 + 8 }}>
                    {cat.name}
                </td>
                <td className="p-2 text-gray-500">{cat.slug}</td>
                <td className="p-2 text-gray-500">{cat.parent?.name ?? '—'}</td>
                <td className="p-2 text-center">{cat.posts_count ?? 0}</td>
                <td className="p-2 flex gap-2">
                    <button onClick={() => onEdit(cat)} className="text-blue-600">Ред.</button>
                    <button onClick={() => onDelete(cat)} className="text-red-600">Удал.</button>
                </td>
            </tr>
            {cat.children?.map(child => <CategoryRow key={child.id} cat={child} depth={depth + 1}  onEdit={onEdit} onDelete={onDelete} />)}
        </>
    );
}
