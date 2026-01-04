const Input = ({
  label,
  type = "text",
  placeholder,
  required=false,
  value,
  onChange,
  rightIcon,
}) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm text-gray-600">{label} {required && <span className="text-red-500"> *</span>} </label>

      <div className="relative">
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />

        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
