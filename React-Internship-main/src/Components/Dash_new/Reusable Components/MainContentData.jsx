import React, { useState } from "react";
import { Button } from "primereact/button";
import Phenotype from "../../Phenotype/Phenotype"; // Assuming Phenotype component is in a separate file
import { MdLocalHospital } from "react-icons/md";
import { TbDna2Off } from "react-icons/tb";
import { MdOutlineMood } from "react-icons/md";
import { TbMoodConfuzed } from "react-icons/tb";
import { TbMoodEmpty } from "react-icons/tb";
import { TbMoodSad } from "react-icons/tb";
import "./MainContentData.css";
import fullScreenIcon from "../../Dash_new/fullscreen.svg";
import exitFullScreenIcon from "../../Dash_new/fullscreen-exit.svg";

const MainContentData = ({
  selectedCondition,
  submittedData,
  handleSeverityClick,
  RenderTabViewContent,
}) => {
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen); // Toggle fullscreen state
  };

  return (
    <div className="main-layout" style={{ overflowY: "hidden" }}>
      {/* Main Content Area */}
      <div className="main-content-container">
        <div className="main-heading-content">
          <div className="main-fullscreen">
            {/* Heading */}
            <h1 className="conditiontitle">
              {selectedCondition ? selectedCondition.replace(/_/g, " ") : " "}
            </h1>

            <div
              className="fullscreen"
              onClick={toggleFullScreen}
              style={{ cursor: "pointer" }}
            >
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
                    left: "1%",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#f9f9f9",
                    borderRadius: "16px",
                    boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.3)",
                    padding: "3px",
                    zIndex: 1000,
                    overflowY: "auto",
                  }}
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

                  {/* Severity and Concern Buttons in a single line */}
                  <div
                    className="severity-buttons"
                    style={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      
                      flexWrap: "wrap", // Ensures the buttons wrap to the next line if needed
                    }}
                  >
                    {["Low", "Mild", "Moderate", "Moderate to High"].map(
                      (severity, idx) => {
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
                            style={{
                              fontSize: "10px", // Reduced size
                              padding: "0.4rem 0.8rem", // Adjusted padding for compactness
                              borderRadius: "12px",
                              backgroundColor: submittedData.find(
                                (entry) =>
                                  entry.condition === selectedCondition &&
                                  entry.severity === severity
                              )
                                ? colors[severity]
                                : "initial",
                              color: "black",
                              
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "5px",
                              minWidth: "5px", // Ensure buttons are evenly sized
                              maxWidth: "120px", // Limit the width
                              justifyContent: "center",
                            }}
                            onClick={() =>
                              handleSeverityClick(severity, "severity")
                            }
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                colors[severity];
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                submittedData.find(
                                  (entry) =>
                                    entry.condition === selectedCondition &&
                                    entry.severity === severity
                                )
                                  ? colors[severity]
                                  : "initial";
                            }}
                          >
                            {icons[severity]}
                            <p style={{ margin: 0 }}>{severity}</p>
                          </Button>
                        );
                      }
                    )}

                    {/* Concern Button */}
                    <Button
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.4rem 0.6rem",
                        color: "black",
                        backgroundColor: submittedData.find(
                          (entry) =>
                            entry.condition === selectedCondition &&
                            entry.Concern === "Yes"
                        )
                          ? "red"
                          : "initial",
                        minWidth: "100px",
                      }}
                      onClick={() => handleSeverityClick(null, "Concern")}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector("p").style.color = "red";
                        e.currentTarget.querySelector("svg").style.color =
                          "red";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector("p").style.color =
                          "initial";
                        e.currentTarget.querySelector("svg").style.color =
                          "initial";
                      }}
                    >
                      <p style={{ margin: 0 }}>Concern</p>
                      <MdLocalHospital />
                    </Button>

                    {/* No Mutation Button */}
                    <Button
                      style={{
                        fontSize: "0.8rem",
                        padding: "0.4rem 0.6rem",
                        color: "black",
                        backgroundColor: submittedData.find(
                          (entry) =>
                            entry.condition === selectedCondition &&
                            entry.NoMutation === "Yes"
                        )
                          ? "red"
                          : "initial",
                        minWidth: "100px",
                      }}
                      onClick={() => handleSeverityClick(null, "NoMutation")}
                      onMouseEnter={(e) => {
                        e.currentTarget.querySelector("p").style.color = "red";
                        e.currentTarget.querySelector("svg").style.color =
                          "red";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.querySelector("p").style.color =
                          "initial";
                        e.currentTarget.querySelector("svg").style.color =
                          "initial";
                      }}
                    >
                      <p style={{ margin: 0 }}>No Mutation</p>
                      <TbDna2Off />
                    </Button>
                  </div>

                  {/* Render Tab View Content */}
                  <div
                    style={{
                      maxHeight: "70%",
                      overflowY: "auto",
                      fontSize: "5rem",
                      padding: "0rem",
                      lineHeight: "1.8",
                      backgroundColor: "red",
                      borderRadius: "12px",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {RenderTabViewContent(selectedCondition)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Concern and No Mutation Buttons */}
          <div className="extra-buttons-style">
            <Button
              style={{
                fontSize: "0.8rem",
                padding: "0.3rem 0.5rem",
                color: "black",
                backgroundColor: submittedData.find(
                  (entry) =>
                    entry.condition === selectedCondition &&
                    entry.Concern === "Yes"
                )
                  ? "red"
                  : "initial",
              }}
              onClick={() => handleSeverityClick(null, "Concern")}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector("p").style.color = "red";
                e.currentTarget.querySelector("svg").style.color = "red";
                // const button = document.getElementById("concernButton");
                // button.style.backgroundColor = "initial";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector("p").style.color = "initial";
                e.currentTarget.querySelector("svg").style.color = "initial";
              }}
            >
              <p style={{ margin: 0 }}>Concern</p>
              <MdLocalHospital />
            </Button>
            <Button
              style={{
                fontSize: "0.8rem",
                padding: "0.3rem 0.5rem",
                color: "black",
                backgroundColor: submittedData.find(
                  (entry) =>
                    entry.condition === selectedCondition &&
                    entry.NoMutation === "Yes"
                )
                  ? "red"
                  : "initial",
              }}
              onClick={() => handleSeverityClick(null, "NoMutation")}
              onMouseEnter={(e) => {
                e.currentTarget.querySelector("p").style.color = "red";
                e.currentTarget.querySelector("svg").style.color = "red";
                // const button = document.getElementById("concernButton");
                // button.style.backgroundColor = "initial";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.querySelector("p").style.color = "initial";
                e.currentTarget.querySelector("svg").style.color = "initial";
              }}
            >
              <p style={{ margin: 0 }}>No Mutation</p>
              <TbDna2Off />
            </Button>
          </div>
        </div>

        {/* Severity Buttons */}
        <div className="severity-buttons" style={{ margin: "1rem 0" }}>
          <Button
            style={{
              fontSize: "0.8rem",
              padding: "0.3rem 0.5rem",
              backgroundColor: submittedData.find(
                (entry) =>
                  entry.condition === selectedCondition &&
                  entry.severity === "Low"
              )
                ? "green"
                : "initial",
            }}
            onClick={() => handleSeverityClick("Low", "severity")}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("p").style.color = "green";
              e.currentTarget.querySelector("svg").style.color = "green";
              // const button = document.getElementById("concernButton");
              // button.style.backgroundColor = "initial";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("p").style.color = "initial";
              e.currentTarget.querySelector("svg").style.color = "initial";
            }}
          >
            <p style={{ margin: 0 }}>Low</p>
            <MdOutlineMood />
          </Button>
          <Button
            style={{
              fontSize: "0.8rem",
              padding: "0.3rem 0.5rem",
              backgroundColor: submittedData.find(
                (entry) =>
                  entry.condition === selectedCondition &&
                  entry.severity === "Mild"
              )
                ? "yellow"
                : "initial",
            }}
            onClick={() => handleSeverityClick("Mild", "severity")}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("p").style.color = "#FFD700";
              e.currentTarget.querySelector("svg").style.color = "#FFD700";
              // const button = document.getElementById("concernButton");
              // button.style.backgroundColor = "initial";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("p").style.color = "initial";
              e.currentTarget.querySelector("svg").style.color = "initial";
            }}
          >
            <p style={{ margin: 0 }}>Mild</p>
            <TbMoodConfuzed />
          </Button>
          <Button
            style={{
              fontSize: "0.8rem",
              padding: "0.3rem 0.5rem",
              backgroundColor: submittedData.find(
                (entry) =>
                  entry.condition === selectedCondition &&
                  entry.severity === "Moderate"
              )
                ? "orange"
                : "initial",
            }}
            onClick={() => handleSeverityClick("Moderate", "severity")}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("p").style.color = "orange";
              e.currentTarget.querySelector("svg").style.color = "orange";
              // const button = document.getElementById("concernButton");
              // button.style.backgroundColor = "initial";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("p").style.color = "initial";
              e.currentTarget.querySelector("svg").style.color = "initial";
            }}
          >
            <p style={{ margin: 0 }}>Moderate</p>
            <TbMoodEmpty />
          </Button>
          <Button
            style={{
              fontSize: "0.8rem",
              padding: "0.3rem 0.5rem",
              backgroundColor: submittedData.find(
                (entry) =>
                  entry.condition === selectedCondition &&
                  entry.severity === "Moderate to High"
              )
                ? "red"
                : "initial",
            }}
            onClick={() => handleSeverityClick("Moderate to High", "severity")}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector("p").style.color = "red";
              e.currentTarget.querySelector("svg").style.color = "red";
              // const button = document.getElementById("concernButton");
              // button.style.backgroundColor = "initial";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector("p").style.color = "initial";
              e.currentTarget.querySelector("svg").style.color = "initial";
            }}
          >
            <p style={{ margin: 0 }}>Moderate to High</p>
            <TbMoodSad />
          </Button>
        </div>

        {/* Render Tab View Content */}
        <div
          style={{ maxHeight: "400px", overflowY: "auto", fontSize: "0.9rem" }}
        >
          {RenderTabViewContent(selectedCondition)}
        </div>
      </div>
    </div>
  );
};

export default MainContentData;
