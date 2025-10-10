import React, { useState } from "react";
import MyDropzone from "./MyDropzone";
import Response from "./Response";
import "./Test.css";

function Test() {
  const [showDropzone, setShowDropzone] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [predictions, setPredictions] = useState([]);

  const handleButtonClick = () => {
    setShowDropzone(true);
  };

  const handleFilesSelected = (files) => {
    setSelectedFiles(files);
  };

  const handlePredictionReceived = (data) => {
    setPredictions(data);
  };

  return (
    <div>
      <div className="test-wrapper">
        {showDropzone ? (
          <div className="dropzone-inline">
            <MyDropzone
              onFilesSelected={handleFilesSelected}
              onPredictionReceived={handlePredictionReceived}
            />
          </div>
        ) : (
          <button onClick={handleButtonClick} className="btn btn-secondary">
            Want to try Using Image
          </button>
        )}
        {predictions.length > 0 && <Response predictions={predictions} />}
      </div>
    </div>
  );
}

export default Test;
