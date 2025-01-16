import React from "react";
import { Button } from "primereact/button";
import Phenotype from "../../Phenotype/Phenotype"; // Assuming Phenotype component is in a separate file
import { MdLocalHospital } from "react-icons/md";
import { TbDna2Off } from "react-icons/tb";
import { MdOutlineMood } from "react-icons/md";
import { TbMoodConfuzed } from "react-icons/tb";
import { TbMoodEmpty } from "react-icons/tb";
import { TbMoodSad } from "react-icons/tb";
import "./MainContentData.css";

const MainContentData = ({
  selectedCondition,
  submittedData,
  handleSeverityClick,
  RenderTabViewContent,
}) => {
  return (
    <div className="main-layout" style={{ overflowY: "hidden" }}>
      {/* Main Content Area */}
      <div className="main-content-container">
        <div className="main-heading-content">
          {/* Heading */}
          <h1 className="conditiontitle">
            {selectedCondition ? selectedCondition.replace(/_/g, " ") : " "}
          </h1>

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
