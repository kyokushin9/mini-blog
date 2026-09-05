import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Login from './pages/Login';

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/posts" element={<Posts />}></Route>
            <Route path="/posts/:id" element={<PostDetail />}></Route>
            <Route path="/login" element={<Login />}></Route>
        </Routes>
    )
}