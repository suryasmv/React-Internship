/* eslint-disable */
import React, { useState, useEffect } from "react";
import {
  CSS,
  SortableContext,
  useSortable,
  Dialog,
  Sidebar,
  SvgImage,
  Card,
  TabView,
  TabPanel,
  Button,
  DataTable,
  Column,
  Dropdown,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useSensor,
  useSensors,
  arrayMove,
  sortableKeyboardCoordinates,
} from "../Libraries/Libraries";
import * as XLSX from "xlsx";
import conditionsData from "../../Conditions/Generated_output.json";
import data from "../../Conditions/output.json";
import reportconditions from "../../Conditions/report_Conditions.json";
import fullScreenIcon from "./fullscreen.svg";
import exitFullScreenIcon from "./fullscreen-exit.svg";
import { Navigate } from "../Libraries/Libraries";
import "./dashboard.css";
import DashboardSearch from "./Dash_search/DashboardSearch";
import Phenotype from "../../Components/Phenotype/Phenotype";

const Task = ({ id, title }) => {
  const { attribute, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  return (
    <div className="task_multiplecard">
      <input
        type="checkbox"
        className="p-checkbox p-checkbox-box"
        name={title}
        id={title}
        style={{ padding: "0px" }}
      />
      <div ref={setNodeRef} {...attribute} {...listeners} style={style}>
        {title}
      </div>
    </div>
  );
};
const Dashboard = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [cardsToDisplay, setCardsToDisplay] = useState(1);
  const [visibleRight, setVisibleRight] = useState(false);
  const [visibleleft, setVisibleleft] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [isPhenotypeVisible, setPhenotypeVisible] = useState(true);

  useEffect(() => {
    const storedColumns = localStorage.getItem("selectedColumns");
    if (storedColumns) {
      setSelectedColumns(JSON.parse(storedColumns));
    }
  }, []);
  const prefered = JSON.parse(localStorage.getItem("preferences") || "[]");
  const [popupVisible, setPopupVisible] = useState(false);
  const [preferences, setPreferences] = useState(prefered);
  const [prefer, setPrefer] = useState(prefered);
  const [sidebarprefer, setsidebarPrefer] = useState(prefered);
  const [logout, setlogout] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const getTaskPos = (id) => preferences.findIndex((task) => task.id === id);

  const handleDragEnd = (e) => {
    const { active, over } = e;
    if (active.id === over.id) return;
    setPreferences((preferences) => {
      const originalPos = getTaskPos(active.id);
      const newPos = getTaskPos(over.id);
      return arrayMove(preferences, originalPos, newPos);
    });
  };

  const [gotocol, setgotocol] = useState(false);
  const [gotoPheno, setgotoPheno] = useState(false);
  if (gotocol) {
    return <Navigate to="/columns_selection" />;
  }
  if (gotoPheno) {
    return <Navigate to="/pdf_view" />;
  }
  const handlegotocol = () => {
    setgotocol(true);
  };
  const handlegotoPheno = () => {
    setgotoPheno(true);
  };
  const pref = preferences;
  const values = [
    { name: "Low", code: "L" },
    { name: "Low to Mild", code: "LM" },
    { name: "Mild to Moderate", code: "MM" },
    { name: "Mild", code: "MIL" },
    { name: "Moderate", code: "MOD" },
    { name: "Moderate to High", code: "MOH" },
    { name: "High", code: "H" },
    { name: "No Mutations", code: "NM" },
    { name: "Fatigue 9. 28. 29.30 which to consider", code: "FTC" },
    { name: "Food Which other disease to consider", code: "FWC" },
  ];
  const concerns = [{ name: "yes", code: "CN" }];

  const handleSeverityClick = (level, property) => {
    if (!selectedCondition) {
      alert("Please select a condition first!");
      return;
    }

    const existingIndex = submittedData.findIndex(
      (entry) => entry.condition === selectedCondition
    );

    if (existingIndex !== -1) {
      // Update the existing condition
      const updatedData = [...submittedData];
      if (property === "severity") {
        updatedData[existingIndex].severity = level;
      } else {
        updatedData[existingIndex][property] =
          updatedData[existingIndex][property] === "Yes" ? "" : "Yes";
      }
      setSubmittedData(updatedData);
    } else {
      // Add new condition with severity or property
      const newEntry = {
        condition: selectedCondition,
        severity: property === "severity" ? level : null,
        Concern: property === "Concern" ? "Yes" : "",
        NoMutation: property === "NoMutation" ? "Yes" : "",
      };
      setSubmittedData([...submittedData, newEntry]);
    }

    console.log(
      `Updated ${property} for ${selectedCondition}: ${level || "Yes"}`
    );
  };

  const [severity, setSeverity] = useState(null); // Holds selected severity
  const [submittedData, setSubmittedData] = useState([]); // Tracks all submissions
  const [visibleData, setVisibleData] = useState(false); // Controls popup visibility

  const handleSeveritySubmit = () => {
    if (!selectedCondition || !severity) {
      alert("Both condition and severity must be selected!");
      return;
    }

    const newEntry = {
      condition: selectedCondition,
      severity: severity,
    };

    // Check if the condition already exists in submittedData
    const existingIndex = submittedData.findIndex(
      (entry) => entry.condition === selectedCondition
    );

    if (existingIndex !== -1) {
      // Replace the severity of the existing condition
      const updatedData = [...submittedData];
      updatedData[existingIndex].severity = severity;
      setSubmittedData(updatedData);
      alert(
        `Updated condition: ${selectedCondition} with severity: ${severity}`
      );
    } else {
      // Add a new entry if the condition doesn't exist
      setSubmittedData([...submittedData, newEntry]);
      alert(`Submitted condition: ${selectedCondition}, severity: ${severity}`);
    }

    setSelectedCondition(null); // Clear after submission
    setSeverity(null); // Clear after submission
  };

  // Function to remove a specific entry
  const handleRemove = (index) => {
    const updatedData = [...submittedData];
    updatedData.splice(index, 1);
    setSubmittedData(updatedData);
  };

  const handleDownload = () => {
    // Define headers with specific severity levels as columns
    const headers = [
      [
        "Condition",
        "Low",
        "Mild",
        "Moderate",
        "Moderate to High",
        "Concern",
        "No Mutation",
      ],
    ];

    // Map submitted data to match the new column structure
    const data = submittedData.map((entry) => [
      entry.condition, // Condition
      entry.severity === "Low" ? "Yes" : "", // Low column
      entry.severity === "Mild" ? "Yes" : "", // Mild column
      entry.severity === "Moderate" ? "Yes" : "", // Moderate column
      entry.severity === "Moderate to High" ? "Yes" : "", // Moderate to High column
      entry.Concern || "", // Concern column
      entry.NoMutation || "", // No Mutation column
    ]);

    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submitted Data");

    // Write workbook to a file
    XLSX.writeFile(workbook, "submitted_data.xlsx");
  };

  // const RenderReportContent = ({ pref, values }) => {
  //   // const initialState = () => {
  //   //     const storedData = reportconditions.reportconditions[0];
  //   //     console.log("store", storedData);
  //   //     return storedData.map(condition => ({
  //   //         name: condition.name,
  //   //         selectedOption: null,
  //   //         concern: null
  //   //     }));
  //   // };
  //   const [conditionNames, setConditionNames] = useState([]);
  //   // useEffect(() => {
  //   //     localStorage.setItem('permanent_pref', JSON.stringify(conditionNames));
  //   // }, [conditionNames]);
  //   // console.log(conditionNames)
  //   useEffect(() => {
  //     // Parse the JSON data
  //     const conditionsData = [
  //       {
  //         reportconditions: [
  //           [
  //             {
  //               name: "Diabetes",
  //             },
  //             {
  //               name: "High Blood pressure",
  //             },
  //             {
  //               name: "Coronary Artery Disease",
  //             },
  //             {
  //               name: "Arrhythmia",
  //             },
  //             {
  //               name: "Heart Failure- Dilated Cardiomyopathy, Restrictive Cardiomyopathy",
  //             },
  //             {
  //               name: "Cholesterol disorders",
  //             },
  //             {
  //               name: "Hypertriglyceridemia",
  //             },
  //             {
  //               name: "Thyroid Disorders- Hypothyroidism, Hyperthyroidism",
  //             },
  //             {
  //               name: "Anemia- Microcytic, Hemolytic",
  //             },
  //             {
  //               name: "Predisposition to Blood clots- Thrombophilia",
  //             },
  //             {
  //               name: "Bleeding Disorders",
  //             },
  //             {
  //               name: "Parkinson’s Disease",
  //             },
  //             {
  //               name: "Alzheimer’s Disease",
  //             },
  //             {
  //               name: "Migraines, Headaches",
  //             },
  //             {
  //               name: "Seizures",
  //             },
  //             {
  //               name: "Inflammatory bowel disease- Crohn’s, Ulcerative colitis",
  //             },
  //             {
  //               name: "Respiratory Allergies",
  //             },
  //             {
  //               name: "Food Allergies",
  //             },
  //             {
  //               name: "Liver Disorders",
  //             },
  //             {
  //               name: "Gall bladder disorders",
  //             },
  //             {
  //               name: "Pancreatic Disorders",
  //             },
  //             {
  //               name: "Nephrotic Syndrome (Focal Segmental Glomerulosclerosis, Membranous nephropathy, Minimal Change Disease)",
  //             },
  //             {
  //               name: "Interstitial Nephritis, Tubulo interstitial Disease",
  //             },
  //             {
  //               name: "Renal Stones- Calcium Oxalate stones, Cystine stones, Uric Acid Stones",
  //             },
  //             {
  //               name: "Dry skin, eczema",
  //             },
  //             {
  //               name: "Skin Allergies",
  //             },
  //             {
  //               name: "Vitiligo",
  //             },
  //             {
  //               name: "Osteoporosis",
  //             },
  //             {
  //               name: "Degenerative Joint Disease, Cartilage degeneration",
  //             },
  //             {
  //               name: "Muscular dystrophy, atrophy",
  //             },
  //             {
  //               name: "Fatigue",
  //             },
  //             {
  //               name: "Mood Disorders- Anxiety, Schizophrenia, Depression",
  //             },
  //             {
  //               name: "Urticaria",
  //             },
  //             {
  //               name: "Essential tremors",
  //             },
  //             {
  //               name: "Renal Disorders",
  //             },
  //             {
  //               name: "Sinusitis, Dust Allergy (Ciliary dykinesia, Hyper IgE syndrome, Angioedma, Chroinc granulomatous)",
  //             },
  //             {
  //               name: "Obesity",
  //             },
  //             {
  //               name: "Skin Health",
  //             },
  //             {
  //               name: "Eye Health",
  //             },
  //             {
  //               name: "Gastritis",
  //             },
  //             {
  //               name: "Fatigue 9. 28. 29.30 which to consider",
  //             },
  //             {
  //               name: "Food Which other disease to consider",
  //             },
  //           ],
  //         ],
  //       },
  //     ];
  //     const conditions = conditionsData[0].reportconditions[0];
  //     // Initialize each condition with selectedOption and concern properties
  //     const conditionNames = conditions.map((condition) => ({
  //       name: condition.name,
  //       selectedOption: null,
  //       concern: null,
  //     }));
  //     setConditionNames(conditionNames);
  //   }, []);

  //   const handleOptionChange = (rowData, newValue) => {
  //     const updatedConditions = conditionNames.map((condition) => {
  //       if (condition.name === rowData.name) {
  //         return { ...condition, selectedOption: newValue };
  //       }
  //       return condition;
  //     });
  //     setConditionNames(updatedConditions);
  //   };
  //   const handleConcernChange = (rowData, newValue) => {
  //     const updatedConditions = conditionNames.map((condition) => {
  //       if (condition.name === rowData.name) {
  //         return { ...condition, concern: newValue };
  //       }
  //       return condition;
  //     });
  //     setConditionNames(updatedConditions);
  //   };

  //   const handleClearRow = (rowData) => {
  //     const updatedConditions = conditionNames.map((condition) => {
  //       if (condition.name === rowData.name) {
  //         return { ...condition, selectedOption: null, concern: null };
  //       }
  //       return condition;
  //     });
  //     setConditionNames(updatedConditions);
  //     localStorage.setItem("permanent_pref", JSON.stringify(updatedConditions));
  //   };
  //   const exportToExcel = () => {
  //     const formattedData = conditionNames.reduce((acc, condition) => {
  //       const rowData = {
  //         "Medical Condition": condition.name,
  //         Low:
  //           condition.selectedOption && condition.selectedOption.code === "L"
  //             ? "y"
  //             : "",
  //         "Low to Mild":
  //           condition.selectedOption && condition.selectedOption.code === "LM"
  //             ? "y"
  //             : "",
  //         Mild:
  //           condition.selectedOption && condition.selectedOption.code === "MIL"
  //             ? "y"
  //             : "",
  //         "Mild to Moderate":
  //           condition.selectedOption && condition.selectedOption.code === "MM"
  //             ? "y"
  //             : "",
  //         Moderate:
  //           condition.selectedOption && condition.selectedOption.code === "MOD"
  //             ? "y"
  //             : "",
  //         "Moderate to High":
  //           condition.selectedOption && condition.selectedOption.code === "MOH"
  //             ? "y"
  //             : "",
  //         High:
  //           condition.selectedOption && condition.selectedOption.code === "H"
  //             ? "y"
  //             : "",
  //         "No Mutations":
  //           condition.selectedOption && condition.selectedOption.code === "NM"
  //             ? "y"
  //             : "",
  //         concerns:
  //           condition.concern && condition.concern.code === "CN" ? "y" : "",
  //         "Food Which other disease to consider":
  //           condition.selectedOption && condition.selectedOption.code === "FWC"
  //             ? "y"
  //             : "",
  //         "Fatigue 9. 28. 29.30 which to consider":
  //           condition.selectedOption && condition.selectedOption.code === "FTC"
  //             ? "y"
  //             : "",
  //       };
  //       acc.push(rowData);
  //       return acc;
  //     }, []);

  //     const worksheet = XLSX.utils.json_to_sheet(formattedData);
  //     const workbook = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(
  //       workbook,
  //       worksheet,
  //       "Medical Conditions Data"
  //     );
  //     XLSX.writeFile(workbook, "medical_conditions_data.xlsx");
  //   };
  //   return (
  //     <div className="table">
  //       <div className="download">
  //         <Button onClick={exportToExcel} label="Download" />
  //       </div>
  //       <DataTable
  //         value={conditionNames}
  //         scrollable={false}
  //         scrollHeight="100%"
  //         showGridlines
  //       >
  //         <Column field="name" header="Condition Name" />
  //         <Column
  //           header="Options"
  //           body={(rowData) => (
  //             <Dropdown
  //               value={rowData.selectedOption}
  //               options={values}
  //               onChange={(e) => handleOptionChange(rowData, e.value)}
  //               optionLabel="name"
  //               placeholder="Select Option"
  //             />
  //           )}
  //         />
  //         <Column
  //           header="Concerns"
  //           body={(rowData) => (
  //             <Dropdown
  //               value={rowData.concern}
  //               options={concerns}
  //               onChange={(e) => handleConcernChange(rowData, e.value)}
  //               optionLabel="name"
  //               placeholder="Select Option"
  //             />
  //           )}
  //         />
  //         <Column
  //           header="Clear"
  //           body={(rowData) => (
  //             <Button
  //               icon="pi pi-times"
  //               onClick={() => handleClearRow(rowData)}
  //               className="p-button-rounded p-button-danger"
  //             />
  //           )}
  //         />
  //       </DataTable>
  //     </div>
  //   );
  // };

  const RenderTabViewContent = (conditionTitle) => {
    if (!conditionTitle) {
      setSelectedCondition(preferences[0].title);
      conditionTitle = preferences[0].title;
    }
    const conditionData = conditionsData.conditions.find(
      (c) => c.name === conditionTitle
    );

    return (
      <div>
        <TabView scrollable style={{ overflowY: "hidden" }}>
          {conditionData.subcategories.map((subcategory, index) => (
            <TabPanel key={index} header={subcategory.name}>
              {subcategory.subtype ? (
                <TabView scrollable style={{ overflowY: "hidden" }}>
                  {subcategory.subtype.map((subtype, subtypeIndex) => (
                    <TabPanel key={subtypeIndex} header={subtype.name}>
                      <div>
                        <DataTable
                          value={data.filter(
                            (item) =>
                              item.Headings === subcategory.name &&
                              item.Condition === subtype.name &&
                              item.subtype_cond === conditionTitle
                          )}
                          scrollable
                          reorderableColumns
                          resizableColumns
                          sortMode="multiple"
                          globalFilterFields={selectedColumns}
                          className={
                            cardsToDisplay === 1
                              ? "single_datatable"
                              : "multiple_datatable"
                          }
                          style={{ maxHeight: "none" }} // Disable max height and vertical overflow
                        >
                          {selectedColumns.map((columnName, index) => (
                            <Column
                              key={index}
                              sortable
                              field={columnName}
                              header={
                                <div
                                  style={{
                                    whiteSpace: "normal",
                                    textAlign: "center",
                                  }}
                                >
                                  {columnName.split(" ").map((part, i) => (
                                    <div key={i}>{part}</div>
                                  ))}
                                </div>
                              }
                              body={(rowData) => {
                                let content;
                                if (typeof rowData[columnName] === "string") {
                                  const names = rowData[columnName].split(",");
                                  const namePairs = [];
                                  for (let i = 0; i < names.length; i += 2) {
                                    namePairs.push(
                                      names.slice(i, i + 2).join(",")
                                    );
                                  }
                                  content = namePairs.map((pair, i) => (
                                    <div key={i}>{pair}</div>
                                  ));
                                } else if (
                                  typeof rowData[columnName] === "number"
                                ) {
                                  content = rowData[columnName];
                                } else {
                                  content = "";
                                }
                                return (
                                  <div style={{ whiteSpace: "normal" }}>
                                    {content}
                                  </div>
                                );
                              }}
                            />
                          ))}
                        </DataTable>
                      </div>
                    </TabPanel>
                  ))}
                </TabView>
              ) : (
                <div>{subcategory.name}</div>
              )}
            </TabPanel>
          ))}
        </TabView>
      </div>
    );
  };
  if (logout) {
    return <Navigate to="/" />;
  }
  const handleSubmit = () => {
    const checkedPreferences = preferences.filter((task) => {
      const checkbox = document.getElementById(task.title);
      return checkbox.checked;
    });
    setPrefer(checkedPreferences);
    setPopupVisible(false);
    setCardsToDisplay(checkedPreferences.length);
    // console.log(checkedPreferences)
  };
  // console.log(prefer)

  const handleSingleCodnition = (selectedCondition) => {
    if (selectedCondition) {
      setCardsToDisplay(1);
      setSelectedCondition(selectedCondition);
      setVisibleleft(false);
    }
  };

  const patients = ["patient1radha", "patient2sukumar"];

  const toggleFullScreen = () => {
    if (!isFullScreen) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullScreen(!isFullScreen);
  };
  const handlelogout = () => {
    // Clear authentication-related cookies
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    setlogout(true);
  };
  return (
    <div className="dashboard">
      <div className="card_navbar">
        <img src={SvgImage} alt="" />

        <DashboardSearch patients={patients} />

        <div className="right_items">
          <div className="fullscreen" onClick={toggleFullScreen}>
            <img
              src={isFullScreen ? exitFullScreenIcon : fullScreenIcon}
              alt=""
              className="fullicon"
            />
          </div>

          <div className="multi_b">
            <Button
              onClick={() => setPopupVisible(true)}
              className=""
              label="Multi-Condition"
            />
            <Dialog
              className="Dialog_hear"
              header="Multiple Conditions"
              visible={popupVisible}
              onHide={() => setPopupVisible(false)}
            >
              <DndContext
                sensors={sensors}
                onDragEnd={handleDragEnd}
                collisionDetection={closestCorners}
              >
                <SortableContext items={preferences}>
                  {preferences.map((task) => (
                    <Task key={task.id} id={task.id} title={task.title} />
                  ))}
                </SortableContext>
              </DndContext>
              <div className="submit_multiconditions">
                <Button onClick={handleSubmit} label="Submit" />
              </div>
            </Dialog>
          </div>

          <div className="report_b">
            <Button
              className=""
              onClick={() => setVisibleData(true)}
              label="Report"
            />
          </div>

          {/* Dialog Popup */}
          <Dialog
            header="Submitted Data"
            visible={visibleData}
            style={{ width: "50vw" }}
            onHide={() => setVisibleData(false)}
          >
            <div className="popup-content">
              {submittedData.length === 0 ? (
                <p>No data submitted yet.</p>
              ) : (
                <ul>
                  {submittedData.map((item, index) => (
                    <li key={index} className="submitted-item">
                      <span>
                        {item.condition}, Severity: {item.severity}, Concern:{" "}
                        {item.Concern}, No Mutation: {item.NoMutation}
                      </span>
                      <Button
                        label="Remove"
                        className="p-button-danger"
                        onClick={() => handleRemove(index)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="download-section">
              <Button label="Download" onClick={handleDownload} />
            </div>
          </Dialog>
          <div className="Back">
            <Button
              label="Columns"
              className="goback_col"
              onClick={handlegotocol}
            />
          </div>

          <div className="dashboard">
            {/* Phenotype Button */}
            {/* <div className="phenotype-toggle">
              <Button
                label="Phenotype"
                className="goback_col"
                onClick={() => setPhenotypeVisible(!isPhenotypeVisible)}
              />
            </div> */}
          </div>

          <div
            className="user_pi"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <i
              className="pi pi-sign-out user_p"
              onClick={handlelogout}
              title={hovered ? "logout" : ""}
            />
          </div>
        </div>
      </div>

      <div className="conditions_cards">
        {cardsToDisplay > 1 && (
          <div className="multiple_cards">
            {prefer.slice(0, cardsToDisplay).map((pp, index) => (
              <div key={index} className="card_to_display">
                <Card className="cards_condition">
                  <div className="card-content">
                    <h1 className="conditiontitle">
                      {pp.title.replace(/_/g, " ")}
                    </h1>
                    <div>{RenderTabViewContent(pp.title)}</div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        )}
        {cardsToDisplay === 1 && (
          <div className="single_card">
            <div className="cards_side_close">
              <Card className="cards_condition">
                {/* Tab and content container */}
                <div className="side-content-container">
                  {/* Sidebar with conditions */}
                  <div
                    visible={visibleleft}
                    position="left"
                    onHide={() => setVisibleleft(false)}
                    className="side-conditions-tab"
                  >
                    {sidebarprefer.map((preference, index) => (
                      <button
                        key={index}
                        className="sidebar_buttons"
                        onClick={() => handleSingleCodnition(preference.title)}
                      >
                        {preference.title}
                      </button>
                    ))}
                  </div>

                  {/* Main content area */}
                  <div>
                    <div
                      className="card-content"
                      style={{
                        width: isPhenotypeVisible ? "43.5em" : "75em",
                      }}
                    >
                      <h1 className="conditiontitle">
                        {selectedCondition
                          ? selectedCondition.replace(/_/g, " ")
                          : " "}
                      </h1>
                      <div className="extra-buttons-style">
                        <Button
                          style={{
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
                          Concern
                        </Button>
                        <Button
                          style={{
                            color: "black",
                            backgroundColor: submittedData.find(
                              (entry) =>
                                entry.condition === selectedCondition &&
                                entry.NoMutation === "Yes"
                            )
                              ? "red"
                              : "initial",
                          }}
                          onClick={() =>
                            handleSeverityClick(null, "NoMutation")
                          }
                        >
                          No Mutation
                        </Button>
                      </div>
                      {/* Severity Selection */}
                      <div className="severity-buttons">
                        <Button
                          style={{
                            backgroundColor: submittedData.find(
                              (entry) =>
                                entry.condition === selectedCondition &&
                                entry.severity === "Low"
                            )
                              ? "red"
                              : "initial",
                          }}
                          onClick={() => handleSeverityClick("Low", "severity")}
                        >
                          Low
                        </Button>
                        <Button
                          style={{
                            backgroundColor: submittedData.find(
                              (entry) =>
                                entry.condition === selectedCondition &&
                                entry.severity === "Mild"
                            )
                              ? "red"
                              : "initial",
                          }}
                          onClick={() =>
                            handleSeverityClick("Mild", "severity")
                          }
                        >
                          Mild
                        </Button>
                        <Button
                          style={{
                            backgroundColor: submittedData.find(
                              (entry) =>
                                entry.condition === selectedCondition &&
                                entry.severity === "Moderate"
                            )
                              ? "red"
                              : "initial",
                          }}
                          onClick={() =>
                            handleSeverityClick("Moderate", "severity")
                          }
                        >
                          Moderate
                        </Button>
                        <Button
                          style={{
                            backgroundColor: submittedData.find(
                              (entry) =>
                                entry.condition === selectedCondition &&
                                entry.severity === "Moderate to High"
                            )
                              ? "red"
                              : "initial",
                          }}
                          onClick={() =>
                            handleSeverityClick("Moderate to High", "severity")
                          }
                        >
                          Moderate to High
                        </Button>
                      </div>

                      <div>{RenderTabViewContent(selectedCondition)}</div>
                    </div>
                  </div>
                  <div>
                    <Phenotype
                      isPhenotypeVisible={isPhenotypeVisible}
                      setPhenotypeVisible={setPhenotypeVisible}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
