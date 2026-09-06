export default function Input({label, name, type = 'text', value, onChange, placeholder, required}) {
    return (
        <label className="block mb-4">
            <span className="text-sm text-gray-600">{label}</span>
            <input
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="mt-1 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </label>
    );
}