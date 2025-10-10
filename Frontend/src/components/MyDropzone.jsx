import { useDropzone } from "react-dropzone";
import { useState, useCallback } from "react";

function MyDropzone({ onFilesSelected, onPredictionReceived }) {
  const [selectedFiles, setSelectedFiles] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    setSelectedFiles(acceptedFiles);
    onFilesSelected(acceptedFiles); // lift files to parent
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const handleSubmit = () => {
    if (selectedFiles.length === 0) return;

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("file", file);
    });

    fetch("http://localhost:8000/predict", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) throw new Error("Upload failed");
        return response.json();
      })
      .then((data) => {
        console.log("Upload success:", data);
        onPredictionReceived(data.predictions || []); // lift predictions to parent
      })
      .catch((error) => {
        console.error("Upload error:", error);
        onPredictionReceived([{ label: "Upload failed", confidence: 0 }]);
      });
  };

  return (
    <section className="container">
      <div
        {...getRootProps({ className: "dropzone" })}
        style={{
          border: "2px dashed #ccc",
          padding: "20px",
          minHeight: "250px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <input {...getInputProps()} />
        {selectedFiles.length === 0 ? (
          <>
            <p>Drag 'n' drop some files here</p>
            <button type="button" onClick={open} className="btn-browse">
              Browse Files
            </button>
          </>
        ) : (
          selectedFiles.map((file) => (
            <img
              key={file.path}
              src={URL.createObjectURL(file)}
              alt="preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "8px",
              }}
            />
          ))
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="text-center mt-3">
          <button onClick={handleSubmit} className="btn-submit">
            Submit Image
          </button>
        </div>
      )}
    </section>
  );
}

export default MyDropzone;
