import React from "react";
import { Button } from "primereact/button";
import { MdOutlineMood, MdLocalHospital } from "react-icons/md";
import { TbMoodConfuzed, TbMoodEmpty, TbMoodSad, TbDna2Off } from "react-icons/tb";
import fullScreenIcon from "../fullscreen.svg";
import exitFullScreenIcon from "../fullscreen-exit.svg";

const FullScreenView = ({
  isFullScreen,
  toggleFullScreen,
  handleSeverityClick,
  selectedCondition,
  RenderTabViewContent,
}) => {
  return (
    <div className="fullscreen" onClick={toggleFullScreen} style={{ cursor: "pointer" }}>
      <img
        src={isFullScreen ? exitFullScreenIcon : fullScreenIcon}
        alt={isFullScreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        className="fullicon"
        style={{ width: "40px", height: "40px" }}
      />
      {isFullScreen && (
        <div
          style={{
            position: "fixed",
            top: "1%",
            left: "0%",
            width: "100%",
            height: "100%",
            backgroundColor: "#f9f9f9",
            borderRadius: "16px",
            boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
            padding: "3px",
            zIndex: 1000,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={toggleFullScreen}
            style={{
              position: "absolute",
              top: "15px",
              right: "15px",
              padding: "5px 5px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "red",
              color: "white",
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Close
          </button>

          {/* Severity and Concern Buttons */}
          <div
            className="severity-buttons"
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            {["Low", "Mild", "Moderate", "Moderate to High"].map((severity, idx) => {
              const colors = {
                Low: "green",
                Mild: "#FFD700",
                Moderate: "orange",
                "Moderate to High": "red",
              };
              const icons = {
                Low: <MdOutlineMood />,
                Mild: <TbMoodConfuzed />,
                Moderate: <TbMoodEmpty />,
                "Moderate to High": <TbMoodSad />,
              };
              return (
                <Button
                  key={idx}
                  style={{ backgroundColor: colors[severity], minWidth: "120px" }}
                  onClick={() => {
                    handleSeverityClick(severity, "severity");
                    toggleFullScreen();
                  }}
                >
                  {icons[severity]} {severity}
                </Button>
              );
            })}
            <Button
              style={{ backgroundColor: "red", minWidth: "100px" }}
              onClick={() => {
                handleSeverityClick(null, "Concern");
                toggleFullScreen();
              }}
            >
              <MdLocalHospital /> Concern
            </Button>
            <Button
              style={{ backgroundColor: "red", minWidth: "100px" }}
              onClick={() => {
                handleSeverityClick(null, "NoMutation");
                toggleFullScreen();
              }}
            >
              <TbDna2Off /> No Mutation
            </Button>
          </div>

          {/* Table Content */}
          <div style={{ width: "97%", overflowX: "auto" }}>
            <div>{RenderTabViewContent(selectedCondition)}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FullScreenView;
