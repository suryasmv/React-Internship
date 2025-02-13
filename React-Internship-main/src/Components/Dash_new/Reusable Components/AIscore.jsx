import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

const AIscore = ({
  selectedPatient,
  selectedConditon,
  severity,
  handleSeverityClick,
  reason,
  setReason,
  aiScore,
  setAiScore,
}) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(true);
  const reasonRef = useRef(""); // Use ref to store input value

  useEffect(() => {
    if (selectedPatient) {
      setLoading(true);
      setError(null);

      fetch(`http://127.0.0.1:5000/get_patient_conditions/${selectedPatient}`)
        .then((response) => response.json())
        .then((data) => {
          setPatientData(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Failed to fetch data");
          setLoading(false);
        });
    }
  }, [selectedPatient]);

  useEffect(() => {
    if (patientData) {
      const aiScoreValue = patientData[selectedConditon];
      setAiScore(aiScoreValue);
      if (severity === aiScoreValue) {
        setReason("");
      }
    }
  }, [patientData, selectedConditon, severity, setAiScore, setReason]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const severityMismatch = severity && aiScore && severity !== aiScore;

  const handleSubmit = () => {
    const enteredReason = reasonRef.current.value; // Get value only on submit
    setReason(enteredReason);

    console.log("Submitting reason:", enteredReason);
    console.log("Triggering handleSeverityClick for aiScore with:", aiScore);

    // ✅ Ensure AI Score update is triggered
    handleSeverityClick(selectedConditon, "aiScore", aiScore);
    handleSeverityClick(selectedConditon, "reason", enteredReason);

    setIsSubmitted(true);
  };

  return (
    <div className="flex flex-col items-center">
      {/* AI Score Button (Changes color & label when severityMismatch is true) */}
      <Button
        style={{
          backgroundColor: severityMismatch ? "red" : "blue",
          color: "white",
        }}
        label={severityMismatch ? `AI Score ${aiScore}` : `AI Score`}
        className="mb-2"
      />

      {/* Show Text Field and Submit Button If There's a Severity Mismatch */}
      {severityMismatch && (
        <div className="flex items-center gap-2">
          <InputText
            ref={reasonRef} // Use ref instead of state
            placeholder="Enter reason"
            className="p-inputtext-sm mb-2"
          />
          <Button
            style={{
              backgroundColor: isSubmitted ? "green" : "blue",
              color: "white",
            }}
            label="Submit"
            onClick={handleSubmit}
          />
        </div>
      )}
    </div>
  );
};

export default AIscore;
