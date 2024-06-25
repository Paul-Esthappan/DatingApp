import React from 'react'

const InputRadioButton = ({
  type = "",
  name = "",
  value = "",
  label = "",
  checked = "",
  onChange = "",
}) => {
  return (
    <div className="flex items-center space-x-4 ">
      {label && (
        <label
          htmlFor={name}
        >
          {label} :
        </label>
      )}

      <input
        type={type}
        id={value}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
      />
    </div>
  );
};

export default InputRadioButton