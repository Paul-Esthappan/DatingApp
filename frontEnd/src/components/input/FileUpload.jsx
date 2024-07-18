import React from "react";

const FileUpload = ({ onChange, label, accept, multiple }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        type="file"
        onChange={onChange}
        accept={accept}
        multiple={multiple}
        className="hidden"
      />
    </label>
    <p className="text-xs text-gray-500 mt-1">Supported formats: {accept}</p>
  </div>
);

export default FileUpload;
