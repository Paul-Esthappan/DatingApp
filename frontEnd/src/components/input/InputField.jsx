import React from "react";

const InputField = ({
  label = "",
  type = "",
  id = "",
  name = "",
  placeholder = "",
  value = "",
  onChange = "",
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-xs font-medium text-gray-700"
          htmlFor={name}
        >
          {label} :
        </label>
      )}

      <input
        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
