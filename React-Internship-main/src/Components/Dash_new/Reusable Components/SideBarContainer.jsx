import React, { useState } from "react";
import "./SideBarContainer.css"; // Import the CSS file

const SideBarContainer = ({
  visibleleft,
  setVisibleleft,
  sidebarprefer,
  handleSingleCodnition,
  submittedConditions, // Accept submitted conditions as a prop
}) => {
  const [selectedPreference, setSelectedPreference] = useState(null); // State for selected preference

  const handleClick = (title) => {
    setSelectedPreference(title); // Set the selected preference
    handleSingleCodnition(title); // Call the parent function
  };

  return (
    <div className={`sidebar-container ${visibleleft ? "visible" : ""}`}>
      <div
        className="sidebar-content"
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center", //in-line styling
        }}
      >
        {sidebarprefer.map((preference, index) => (
          <button
            key={index}
            className={`sidebar-button ${
              selectedPreference === preference.title ? "selected" : ""
            } ${
              submittedConditions.includes(preference.title) ? "submitted" : ""
            }`} // Add 'submitted' class if condition is in submittedConditions
            onClick={() => handleClick(preference.title)}
          >
            <img
              src={preference.icon}
              className="condition-icons"
              alt={preference.title}
            />
            <span
              style={{
                width: "100%",
                wordWrap: "break-word",
                textAlign: "center" /* Center-align the text */,
              }}
            >
              {preference.title}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideBarContainer;
