import PostCard from './PostCard';
import Pagination from '../UI/Pagination';

export default function PostList({ posts, currentPage, lastPage, onPageChange }) {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(posts ?? []).map(post => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
            <Pagination currentPage={currentPage} lastPage={lastPage} onPageChange={onPageChange} />
        </div>
    );
}
