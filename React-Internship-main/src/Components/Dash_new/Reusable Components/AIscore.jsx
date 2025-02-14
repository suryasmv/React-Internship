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
  concern, // Added concern prop
}) => {
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showScore, setShowScore] = useState(false); // Toggle AI score visibility
  const reasonRef = useRef(null);

  useEffect(() => {
    if (selectedPatient) {
      setLoading(true);
      setError(null);

      fetch(`http://127.0.0.1:5000/get_patient_conditions/${selectedPatient}`)
        .then((response) => response.json())
        .then((data) => {
          setPatientData(data);
          setAiScore(data ? data[selectedConditon] : null);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch data");
          setLoading(false);
        });
    }
  }, [selectedPatient, selectedConditon, setAiScore]);

  const severityMismatch = severity && aiScore && severity !== aiScore;
  const shouldAutoSubmit = severity === aiScore; // Auto-submit condition

  const handleSubmit = () => {
    const enteredReason = reasonRef.current?.value || ""; // Ensure it starts as an empty string
    setReason(enteredReason);

    console.log("Submitting reason:", enteredReason);
    console.log("Triggering handleSeverityClick for aiScore with:", aiScore);

    handleSeverityClick(selectedConditon, "aiScore", aiScore);
    handleSeverityClick(selectedConditon, "reason", enteredReason);

    setIsSubmitted(true);
    if (reasonRef.current) {
      reasonRef.current.value = ""; // ✅ Clear input field after submit
    }
  };

  // ✅ Auto-submit if severity and concern match
  useEffect(() => {
    if (shouldAutoSubmit) {
      setReason(""); // ✅ Ensure reason is empty before auto-submitting
      handleSubmit();
    }
  }, [shouldAutoSubmit]); // Runs when shouldAutoSubmit changes

  return (
    <div className="flex flex-col items-center">
      {/* ✅ Show loading and error inside JSX instead of returning early */}
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}

      {/* ✅ Click to Reveal/Hide AI Score */}
      {!loading && !error && (
        <>
          <Button
            style={{
              backgroundColor: severityMismatch ? "red" : "blue",
              color: "white",
            }}
            label={showScore ? `AI Score: ${aiScore}` : "AI Score"}
            className="mb-2"
            onClick={() => setShowScore((prev) => !prev)} // ✅ Toggle AI score visibility
          />

          {/* ✅ Show Text Field & Submit Only If Needed */}
          {!shouldAutoSubmit && severityMismatch && (
            <div className="flex items-center gap-2">
              <InputText ref={reasonRef} placeholder="Enter reason" className="p-inputtext-sm mb-2" />
              <Button
                style={{ backgroundColor: isSubmitted ? "green" : "blue", color: "white" }}
                label="Submit"
                onClick={handleSubmit}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AIscore;
