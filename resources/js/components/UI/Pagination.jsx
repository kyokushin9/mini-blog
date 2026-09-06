export default function Pagination({currentPage, lastPage, onPageChange }){
    const pages = [];
    for(let i = 1; i <=lastPage ;i++) pages.push(i);

    return (
        <nav className="flex gap-2 mt-6">
            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 rounded border ${
                        p === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
                    }`}
                >
                {p}
                </button>
            ))}
        </nav>
    );
}