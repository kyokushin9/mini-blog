import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import PostForm from './components/Post/PostForm';
import CategoryDetail from './pages/CategoryDetail';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';
import PostManager from './pages/admin/PostManager';
import CategoryManager from './pages/admin/CategoryManager';

export default function App() {
    return (
        <Routes>
            {/* Общедоступные страницы */}
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/posts/:id" element={<PostDetail />} />
                <Route path="/categories/:id" element={<CategoryDetail />} />
                <Route path="/login" element={<Login />} />

                {/* Создание/редактирование — только автор или админ */}
                <Route path="/posts/create" element={
                    <ProtectedRoute allowedRoles={['author', 'admin']}>
                        <PostForm />
                    </ProtectedRoute>
                } />
                <Route path="/posts/:id/edit" element={
                    <ProtectedRoute allowedRoles={['author', 'admin']}>
                        <PostForm />
                    </ProtectedRoute>
                } />
            </Route>

            {/* Админ-панель — только админ */}
            <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['admin']}>
                    <AdminLayout />
                </ProtectedRoute>
            }>
                <Route index element={<PostManager />} />
                <Route path="posts" element={<PostManager />} />
                <Route path="categories" element={<CategoryManager />} />
            </Route>
        </Routes>
    );
}
