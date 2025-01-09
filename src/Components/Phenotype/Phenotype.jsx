import React, { useState, useCallback } from "react";
import { Sidebar, Button, Checkbox, Dialog } from "primereact";
import "./Phenotype.css";

const Phenotype = () => {
  const [visiblePhenoSidebar, setVisiblePhenoSidebar] = useState(false);
  const [selectedPhenos, setSelectedPhenos] = useState([]);
  const [visibleDialog, setVisibleDialog] = useState(false);
  const [dialogSelection, setDialogSelection] = useState([]);

  const phenotypeFiles = [
    { name: "Pheno 1", path: "/KHDEOMGPCSP8_Sreeram Reddy Vanga_Report.pdf" },
    { name: "Pheno 2", path: "/KHDEOMGPCSP17_Warren Alemao_Report.pdf" },
    { name: "Pheno 3", path: "/KHDEOMGPCSP20_Sujeet Kumar_Report (1).pdf" },
  ];

  const handlePhenoSelection = useCallback((filePath) => {
    setSelectedPhenos([filePath]);
  }, []);

  const handlePdfLimitChange = useCallback((limit) => {
    if (limit === 2) {
      setVisibleDialog(true);
    } else {
      setSelectedPhenos([]);
    }
  }, []);

  const handleDialogSelection = useCallback(() => {
    setSelectedPhenos(dialogSelection);
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

  const renderSidebar = useCallback(
    () => (
      <Sidebar
        className="phenotype-sidebar-wrapper"
        header="Phenotype Viewer"
        visible={visiblePhenoSidebar}
        position="right"
        onHide={() => setVisiblePhenoSidebar(false)}
        style={{ width: "60vw" }}
      >
        <div className="phenotype-controls">
          <div
            className="phenotype-buttons"
            style={{ display: "flex", flexDirection: "row" }}
          >
            {phenotypeFiles.map((file, index) => (
              <Button
                key={file.name}
                label={`Pheno ${index + 1}`}
                className="phenotype-btn"
                onClick={() => handlePhenoSelection(file.path)}
              />
            ))}
          </div>
        </div>

        <div className="phenotype-checkboxes">
          <div className="phenotype-checkbox-container">
            <Checkbox
              inputId="one"
              checked={selectedPhenos.length === 1}
              onChange={() => handlePdfLimitChange(1)}
            />
            <label htmlFor="one">1</label>
            <Checkbox
              inputId="two"
              checked={selectedPhenos.length === 2}
              onChange={() => handlePdfLimitChange(2)}
            />
            <label htmlFor="two">2</label>
          </div>
        </div>

        <div
          className="phenotype-pdf-display"
          style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}
        >
          {selectedPhenos.map((filePath, index) => (
            <iframe
              key={index}
              src={filePath}
              title={filePath}
              style={{
                width: selectedPhenos.length === 2 ? "48%" : "48%", // 50% for two PDFs, 100% for one
                height: "100vh", // Ensure the iframe uses full height
                border: "none", // Remove iframe border
              }}
              frameBorder="0"
            />
          ))}
        </div>

        {visibleDialog && (
          <Dialog
            visible={visibleDialog}
            onHide={() => setVisibleDialog(false)}
            header="Select PDFs"
            footer={
              <div>
                <Button
                  label="Cancel"
                  onClick={() => setVisibleDialog(false)}
                  className="p-button-text"
                />
                <Button label="Confirm" onClick={handleDialogSelection} />
              </div>
            }
          >
            <div className="phenotype-checkbox-container">
              {phenotypeFiles.map((file) => (
                <div key={file.name}>
                  <Checkbox
                    inputId={file.name}
                    checked={dialogSelection.includes(file.path)}
                    disabled={
                      dialogSelection.length >= 2 &&
                      !dialogSelection.includes(file.path)
                    }
                    onChange={() => handleCheckboxChange(file.path)}
                  />
                  <label htmlFor={file.name}>{file.name}</label>
                </div>
              ))}
            </div>
          </Dialog>
        )}
      </Sidebar>
    ),
    [
      visiblePhenoSidebar,
      selectedPhenos,
      phenotypeFiles,
      visibleDialog,
      dialogSelection,
    ]
  );

  return {
    renderSidebar,
    toggleSidebar: () => setVisiblePhenoSidebar(!visiblePhenoSidebar),
  };
};

export default Phenotype;
