import React from "react";

const InputCheckBox = ({
  label,
  name,
  options,
  formData,
  onChange,
  className,
}) => {
  return (
    <div className={className}>
      <label className="block mb-2 text-xs font-medium text-gray-700">{label}</label>
      {options.map((option) => (
        <div className="mb-2" key={option.value}>
          <input
            type="checkbox"
            id={option.value}
            name={name}
            value={option.value}
            checked={formData[name].includes(option.value)}
            onChange={onChange}
          />
          <label htmlFor={option.value} className="ml-2">
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
};

export default InputCheckBox;
