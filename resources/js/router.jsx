import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';
import PostForm from "./components/post/postForm";
import Layout from './components/Layout/Layout';

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />}></Route>
                <Route path="/posts" element={<Posts />}></Route>
                <Route path="/posts/:id" element={<PostDetail />}></Route>
                <Route path="/posts/:id/edit" element={<PostForm categories={[]} />}></Route>
                <Route path="/posts/create" element={<PostForm categories={[]} />}></Route>
                <Route path="/login" element={<Login />}></Route>
            </Route>
            
        </Routes>
    )
}