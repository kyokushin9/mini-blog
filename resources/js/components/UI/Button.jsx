export default function Button({children, onClick, type = 'button', variant = 'primary', disabled}) {
    const styles = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-gray-200 hover:bg-grey-300 text-grey-800',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
    }[variant];

    return (
        <button 
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded font-medium disabled:opacity-50 ${styles}`}
        >
            { children }
        </button>
    );
}