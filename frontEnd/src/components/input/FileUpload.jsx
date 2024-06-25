import React, { useState } from "react";

const FileUpload = ({ label, onChange, multiple = false, accept = "*/*" }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    if (onChange) {
      onChange(files);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label
          className="block text-xs font-medium text-gray-700"
          htmlFor="file-upload"
        >
          {label} :
        </label>
      )}
      <input
        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
        type="file"
        id="file-upload"
        multiple={multiple}
        accept={accept}
        onChange={handleFileChange}
      />
      {selectedFiles.length > 0 && (
        <div className="mt-2">
          <strong>Selected files:</strong>
          <ul className="list-disc list-inside text-sm">
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
