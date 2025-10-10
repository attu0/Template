import React from "react";

function Response({ predictions }) {
  const label = predictions[0]?.label || "No prediction available";

  return (
    <div className="response-box">
      <p>{label}</p>
    </div>
  );
}

export default Response;
