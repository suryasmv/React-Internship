import React, { useState, useCallback } from "react";
import { Button, Checkbox, Dialog } from "primereact";
import "./Phenotype.css";

const Phenotype = ({ isPhenotypeVisible, setPhenotypeVisible }) => {
  const [selectedPhenos, setSelectedPhenos] = useState([]);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [dialogSelection, setDialogSelection] = useState([]);

  const phenotypeFiles = [
    { name: "Pheno 1", path: "/KHDEOMGPCSP8_Sreeram Reddy Vanga_Report.pdf" },
    { name: "Pheno 2", path: "/KHDEOMGPCSP17_Warren Alemao_Report.pdf" },
    { name: "Pheno 3", path: "/KHDEOMGPCSP20_Sujeet Kumar_Report (1).pdf" },
  ];

  const handleSingleSelection = useCallback((filePath) => {
    setSelectedPhenos([filePath]); // Reset to only one selection
  }, []);

  const handleMultipleSelection = useCallback(() => {
    setVisibleDialog(true); // Open dialog for multiple selection
  }, []);

  const handleDialogSelection = useCallback(() => {
    setSelectedPhenos(dialogSelection); // Update selected PDFs from dialog
    setVisibleDialog(false);
  }, [dialogSelection]);

  const handleCheckboxChange = useCallback(
    (filePath) => {
      if (dialogSelection.includes(filePath)) {
        setDialogSelection(dialogSelection.filter((path) => path !== filePath));
      } else if (dialogSelection.length < 2) {
        setDialogSelection([...dialogSelection, filePath]);
      }
    },
    [dialogSelection]
  );

  return (
    <section
      className={`phenotype-section ${
        isPhenotypeVisible ? "visible" : "hidden"
      }`}
      style={{
        width: "40em", // Extend by 10px
      }}
    >
      <div className="phenotype-controls">
        <div className="phenotype-buttons">
          {phenotypeFiles.map((file) => (
            <Button
              key={file.name}
              label={file.name}
              className="phenotype-btn"
              onClick={() => handleSingleSelection(file.path)}
            />
          ))}
        </div>
      </div>

      <div className="phenotype-checkboxes">
        <div className="phenotype-checkbox-container">
          <Checkbox
            inputId="one"
            checked={selectedPhenos.length === 1}
            onChange={() => setSelectedPhenos([])} // Reset for single selection
          />
          <label htmlFor="one">1</label>
          <Checkbox
            inputId="two"
            checked={selectedPhenos.length === 2}
            onChange={handleMultipleSelection} // Open dialog for multiple selection
          />
          <label htmlFor="two">2</label>
        </div>
      </div>

      <div
        className="phenotype-pdf-display"
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
          width: "100%", // Extend by 10px
        }}
      >
        {selectedPhenos.map((filePath, index) => (
          <iframe
            key={index}
            src={filePath}
            title={`Phenotype Report ${index + 1}`}
            style={{
              width: selectedPhenos.length === 2 ? "48%" : "100%",
              height: "100vh",
              border: "none",
            }}
            frameBorder="0"
          />
        ))}
      </div>

      <Dialog
        visible={visibleDialog}
        style={{ width: "50vw" }}
        header="Select up to 2 PDFs"
        footer={
          <div>
            <Button
              label="Confirm"
              onClick={handleDialogSelection}
              disabled={dialogSelection.length !== 2}
            />
            <Button
              label="Cancel"
              onClick={() => setVisibleDialog(false)}
              className="p-button-secondary"
            />
          </div>
        }
        onHide={() => setVisibleDialog(false)}
      >
        {phenotypeFiles.map((file) => (
          <div key={file.name} style={{ display: "flex", alignItems: "center" }}>
            <Checkbox
              inputId={file.name}
              checked={dialogSelection.includes(file.path)}
              onChange={() => handleCheckboxChange(file.path)}
            />
            <label htmlFor={file.name} style={{ marginLeft: "10px" }}>
              {file.name}
            </label>
          </div>
        ))}
      </Dialog>
    </section>
  );
};

export default Phenotype;
