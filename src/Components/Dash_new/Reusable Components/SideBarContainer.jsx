import React, { useState } from 'react';
import './SideBarContainer.css'; // Import the CSS file

const SideBarContainer = ({ visibleleft, setVisibleleft, sidebarprefer, handleSingleCodnition }) => {
  const [selectedPreference, setSelectedPreference] = useState(null); // State for selected preference

  const handleClick = (title) => {
    setSelectedPreference(title); // Set the selected preference
    handleSingleCodnition(title); // Call the parent function
  };

  return (
    <div className={`sidebar-container ${visibleleft ? 'visible' : ''}`}>
  <div className="sidebar-content">
    {sidebarprefer.map((preference, index) => (
      <button
        key={index}
        className={`sidebar-button ${selectedPreference === preference.title ? 'selected' : ''}`}
        onClick={() => handleClick(preference.title)}
      >
        <img src={preference.icon} className="condition-icons" alt={preference.title} />
        {preference.title}
      </button>
    ))}
  </div>
</div>

  );
};

export default SideBarContainer;
