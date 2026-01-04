const RadioGroup = ({ label, name, options, value, onChange, required }) => {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-gray-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <div className="flex gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex cursor-pointer items-center gap-2 text-sm"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              required={required}
              className="accent-indigo-600"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
