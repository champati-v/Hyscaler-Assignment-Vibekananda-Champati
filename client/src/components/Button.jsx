const Button = ({ children, onClick, type = "button", disabled }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-md bg-indigo-600 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
};

export default Button;
