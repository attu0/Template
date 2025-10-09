import React, { useState } from "react";
import MyDropzone from "./MyDropzone";
import "./Test.css";
import Response from "./Response";

function Test() {
  const [showDropzone, setShowDropzone] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleButtonClick = () => {
    setShowDropzone(true);
  };

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
  };

  const handleSubmit = () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file); // match FastAPI field name
    });

    fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Upload success:", data);
        alert("Upload successful!");
      })
      .catch((err) => {
        console.error("Upload error:", err);
        alert("Upload failed!");
      });
  };

  return (
    <div className="test-wrapper">
      {showDropzone ? (
        <div className="dropzone-inline">
          <MyDropzone onFilesSelected={handleFilesSelected} />
          {selectedFiles.length > 0 && (
            <button onClick={handleSubmit} className="btn btn-primary mt-3">
              Submit Image
            </button>
          )}
        </div>
      ) : (
        <button onClick={handleButtonClick} className="btn btn-secondary">
          Want to try Using Image
        </button>
      )}
    </div>
  );
}

export default Test;
