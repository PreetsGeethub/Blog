function Input({
    label,
    type = "text",
    className = "",
    ...rest // captures all extra props like onChange, value, placeholder, etc.
  }) {
    return (
      <div className="flex flex-col gap-1">
        {label && <label className="text-sm font-medium">{label}</label>}
        <input
          type={type}
          className={`border border-gray-300 rounded-lg p-2 ${className}`}
          {...rest}
        />
      </div>
    );
  }
  