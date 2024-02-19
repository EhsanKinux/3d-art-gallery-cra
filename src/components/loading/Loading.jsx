import React from "react";
import "../../index.css"
const Loading = () => {
  return (
    <div className="progress-bar-container">
      <label htmlFor="progress-bar">Loading ...</label>
      <progress id="progress-bar" value="0" max="100"></progress>
    </div>
  );
};

export default Loading;
