/* eslint-disable */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
//import conditionsData from "../../Conditions/Generated_output.json";
//import data from "../../Conditions/output.json";
// import reportconditions from "../../Conditions/report_Conditions.json";
import fullScreenIcon from "./fullscreen.svg";
import exitFullScreenIcon from "./fullscreen-exit.svg";
import { Navigate } from "../Libraries/Libraries";
import "./dashboard.css";
import DashboardSearch from "./Dash_search/DashboardSearch";
import Phenotype from "../../Components/Phenotype/Phenotype";
import MultiConditionButton from "./Reusable Components/MultiConditionButton";
import SideBarContainer from "./Reusable Components/SideBarContainer";
import MainContentData from "./Reusable Components/MainContentData";
import ReportHandleButton from "./Reusable Components/ReportHandleButton";

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
  const [aiScore, setAiScore] = useState();
  const [reason, setReason] = useState();
  const [submittedConditions, setSubmittedConditions] = useState([]); // Track submitted conditions
  const [removedCondition, setRemovedCondition] = useState(null);

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
  const [conditionsData, setConditionsData] = useState(null);
  const [data, setData] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [error, setError] = useState(null);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

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

  const navigate = useNavigate();

  const handlegotocol = () => {
    navigate("/columns_selection");
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

  const handleSeverityClick = (level, property, value = "Y") => {
    if (!selectedCondition) {
      alert("Please select a condition first!");
      return;
    }

    const existingIndex = submittedData.findIndex(
      (entry) => entry.condition === selectedCondition
    );

    let updatedData = [...submittedData];

    if (existingIndex !== -1) {
      // Update existing condition
      if (property === "severity") {
        updatedData[existingIndex].severity = level;
        
        if (level === aiScore) {
          // Directly assign AI score when severity matches
          updatedData[existingIndex].AIscore = aiScore;
          updatedData[existingIndex].Reason = ""; // No reason required
        } else {
          // Store AI score and reason but send only on submit
          updatedData[existingIndex].AIscore = aiScore;
          updatedData[existingIndex].Reason = reason || "";
        }
      } else {
        // Toggle other properties like Concern, NoMutation
        updatedData[existingIndex][property] =
          updatedData[existingIndex][property] === value ? "" : value;
      }
    } else {
      // Add new condition
      const newEntry = {
        condition: selectedCondition,
        severity: property === "severity" ? level : null,
        Concern: property === "Concern" ? "Y" : "",
        NoMutation: property === "NoMutation" ? "Y" : "",
        AIscore: level === aiScore ? aiScore : "", // Set AI score only if severity matches
        Reason: level === aiScore ? "" : reason || "", // Reason only if severity mismatches
      };
      updatedData.push(newEntry);
    }

    setSubmittedData(updatedData);

    if (!submittedConditions.includes(selectedCondition)) {
      setSubmittedConditions([...submittedConditions, selectedCondition]);
    }

    console.log(
      `Updated ${property} for ${selectedCondition}: ${level || value}`
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
      AIscore: aiScore,
      Reason: reason || "",
    };

    // Check if the condition already exists in submittedData
    const existingIndex = submittedData.findIndex(
      (entry) => entry.condition === selectedCondition
    );

    if (existingIndex !== -1) {
      // Replace the severity of the existing condition
      const updatedData = [...submittedData];
      updatedData[existingIndex].severity = severity;
      updatedData[existingIndex].AIscore = aiScore;
      updatedData[existingIndex].Reason = reason || "";
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
  // Function to remove a specific entry
  const handleRemove = (index) => {
    const updatedData = [...submittedData];
    const removed = updatedData.splice(index, 1)[0];
    setSubmittedData(updatedData);
    setRemovedCondition(removed.condition); // Set the removed condition
    setSubmittedConditions((prevConditions) =>
      prevConditions.filter((condition) => condition !== removed.condition)
    ); // Update submittedConditions state
  };

  const handleDownload = () => {
    const headers = [
      [
        "Condition",
        "Low",
        "Mild",
        "Moderate",
        "Moderate to High",
        "Concern",
        "No Mutation",
        "AI Score",
        "Reason",
      ],
    ];

    const data = submittedData.map((entry) => [
      entry.condition,
      entry.severity === "Low" ? "Y" : "",
      entry.severity === "Mild" ? "Y" : "",
      entry.severity === "Moderate" ? "Y" : "",
      entry.severity === "Moderate to High" ? "Y" : "",
      entry.Concern || "",
      entry.NoMutation || "",
      entry.aiScore || "",
      entry.reason || "",
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([...headers, ...data]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Submitted Data");

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

  // Function to fetch data from both APIs
  const fetchDataFromAPIs = async () => {
    try {
      // Fetch conditions data
      const responseConditionsData = await fetch(
        "http://127.0.0.1:5000/get-patient-data"
      );
      if (!responseConditionsData.ok) {
        throw new Error(`
          Error fetching conditionsData: ${responseConditionsData.statusText}
        `);
      }
      const conditionsJsonData = await responseConditionsData.json();
      setConditionsData(conditionsJsonData);

      // Fetch other data
      const responseData = await fetch(
        "http://127.0.0.1:5000/get-patient-data2"
      );
      if (!responseData.ok) {
        throw new Error(`Error fetching data: ${responseData.statusText}`);
      }
      const jsonData = await responseData.json();
      setData(jsonData);
    } catch (err) {
      setError(`Failed to fetch data: ${err.message}`);
    }
  };

  // UseEffect to call the fetchDataFromAPIs function when the component mounts
  useEffect(() => {
    fetchDataFromAPIs();
  }, []); // Ensuring this is only called once

  // Render loading, error, or the data
  if (error) {
    return <div>Error: {error}</div>;
  }

  if (conditionsData === null || data === null) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
      </div>
    );
  }

  const RenderTabViewContent = () => {
    let renderPatient = `${selectedPatient}.xlsx`;

    if (!renderPatient) return null; // Early exit if no patient is selected

    // Check if the patient exists and retrieve their data
    const patientData = data[renderPatient];
    console.log("Selected Patient Data:", patientData);

    let conditionTitle = selectedCondition; // Default condition title
    if (!conditionTitle) {
      setSelectedCondition(preferences[0].title);
      conditionTitle = preferences[0].title;
    }
    console.log("Condition Title:", conditionTitle);

    // Access the patient file data (e.g., "KHAIGHGPTTL569_GH_final_output.xlsx")
    const selectedPatientData = conditionsData.conditions[renderPatient];
    console.log("Selected Patient Conditions Data:", selectedPatientData);

    // Make sure the data exists
    if (!selectedPatientData) {
      console.warn("No data available for the selected patient.");
      return <div>No data available for the selected patient.</div>;
    }

    // Find the specific condition based on the condition title
    const conditionData = selectedPatientData.subcategories.find(
      (subcategory) => subcategory.name === conditionTitle
    );
    console.log("Condition Data:", conditionData);

    // Ensure conditionData is valid
    if (!conditionData) {
      console.warn("No condition data available for the selected condition.");
      return <div>No condition data available for the selected condition.</div>;
    }

    const getCellStyle = (columnName, value) => {
      switch (columnName) {
        case "Zygosity":
          return value === "Homozygous Variant"
            ? { backgroundColor: "orange" }
            : {};
        case "clin sig":
          return value === "Uncertain Significance"
            ? { backgroundColor: "yellow" }
            : {};
        case "IMPACT":
          return value === "HIGH" ? { backgroundColor: "red" } : {};
        case "Lit":
          return value === "Yes"
            ? { backgroundColor: "green", color: "white" }
            : value === "No"
            ? { backgroundColor: "violet" }
            : {};
        default:
          return {};
      }
    };

    return (
      <div>
        <TabView scrollable>
          {conditionData.subcategories.map((subcategory, index) => {
            console.log("Subcategory Data:", subcategory);
            return (
              <TabPanel
                key={index}
                header={
                  <span style={{ fontSize: "14px", position: "sticky" }}>
                    {subcategory.name}
                  </span>
                }
              >
                {subcategory.subtype ? (
                  <TabView scrollable>
                    {subcategory.subtype.map((subtype, subtypeIndex) => {
                      console.log("Subtype Data:", subtype);
                      return (
                        <TabPanel
                          key={subtypeIndex}
                          header={
                            <span style={{ fontSize: "14px" }}>
                              {subtype.name}
                            </span>
                          }
                        >
                          <div className="datatable-container">
                            <DataTable
                              value={patientData?.conditions?.filter((item) => {
                                return (
                                  item.Headings === subcategory.name &&
                                  item.Condition === subtype.name &&
                                  item.subtype_cond === conditionTitle
                                );
                              })}
                              reorderableColumns
                              resizableColumns
                              className="doctor-datatable"
                              scrollable
                              scrollHeight="400px" // Enables vertical scrolling
                              sortMode="multiple"
                              globalFilterFields={selectedColumns}
                              style={{
                                fontSize: "14px",
                                maxHeight: "500px", // Ensures table height is limited
                                overflow: "auto",
                              }}
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
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {columnName.split(" ").map((part, i) => (
                                        <div key={i}>{part}</div>
                                      ))}
                                    </div>
                                  }
                                  body={(rowData) => {
                                    let content;
                                    if (
                                      typeof rowData[columnName] === "string"
                                    ) {
                                      const names =
                                        rowData[columnName].split(",");
                                      content = names.map((name, i) => (
                                        <div key={i}>{name}</div>
                                      ));
                                    } else if (
                                      typeof rowData[columnName] === "number"
                                    ) {
                                      content = rowData[columnName];
                                    } else {
                                      content = "";
                                    }
                                    return (
                                      <div
                                        style={{
                                          whiteSpace: "normal",
                                          textAlign: "left",
                                          fontSize: "14px",
                                          ...getCellStyle(
                                            columnName,
                                            rowData[columnName]
                                          ),
                                        }}
                                      >
                                        {content}
                                      </div>
                                    );
                                  }}
                                  style={{
                                    minWidth: "50px",
                                    textAlign: "center",
                                  }}
                                />
                              ))}
                            </DataTable>
                          </div>
                        </TabPanel>
                      );
                    })}
                  </TabView>
                ) : (
                  <div>{subcategory.name}</div>
                )}
              </TabPanel>
            );
          })}
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

  // const useFetchPatientNames = () => {
  //   const [patients, setPatients] = useState([]);

  //   // Function to fetch patient names
  //   const fetchPatientNames = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:5000/get-file-names");
  //       const data = await response.json();
  //       console.log("Fetched patient names:", data.file_names); // Debugging log
  //       setPatients(data.file_names || []); // Update patients dynamically
  //     } catch (error) {
  //       console.error("Error fetching patient names:", error);
  //     }
  //   };

  //   // Call the fetch function inside useEffect
  //   useEffect(() => {
  //     fetchPatientNames();
  //   }, []);

  //   return { patients, fetchPatientNames };
  // };

  // const { patients } = useFetchPatientNames();

  // const [patients, setPatients] = useState([]);
  // const PatientSearch = () => {

  //   useEffect(() => {
  //     // Fetch data from the API
  //     const fetchPatients = async () => {
  //       try {
  //         const response = await fetch("http://127.0.0.1:5000/get-file-names");
  //         if (!response.ok) {
  //           throw new Error("Failed to fetch patients");
  //         }
  //         const data = await response.json(); // Assuming the API returns JSON
  //         setPatients(data);
  //       } catch (error) {
  //         console.error("Error fetching patients:", error);
  //       }
  //     };

  //     fetchPatients();
  //   }, []); // Empty dependency array means this runs once when the component mounts
  // };

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
        <DashboardSearch onSelectPatient={handleSelectPatient} />
        <div className="right_items">
          <div className="fullscreen" onClick={toggleFullScreen}>
            <img
              src={isFullScreen ? exitFullScreenIcon : fullScreenIcon}
              alt=""
              className="fullicon"
            />
          </div>
          <MultiConditionButton
            preferences={preferences}
            sensors={sensors}
            handleDragEnd={handleDragEnd}
            closestCorners={closestCorners}
            handleSubmit={handleSubmit}
          />

          {/* Dialog Popup */}
          <ReportHandleButton
            submittedData={submittedData}
            handleRemove={handleRemove}
            handleDownload={handleDownload}
          />

          <div className="Back">
            <Button
              label="Columns"
              className="goback_col"
              onClick={handlegotocol}
            />
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
        {cardsToDisplay === 1 && (
          <div className="side-content-container">
            {/* All three containers displayed side by side */}
            <div className="cards-container">
              {/* Sidebar container */}
              {sidebarprefer && (
                <div className="card sidebar">
                  <SideBarContainer
                    visibleleft={visibleleft}
                    setVisibleleft={setVisibleleft}
                    sidebarprefer={sidebarprefer}
                    handleSingleCodnition={handleSingleCodnition}
                    submittedConditions={submittedConditions}
                    setSubmittedConditions={setSubmittedConditions}
                    removedCondition={removedCondition}
                    selectedPatient={selectedPatient}
                  />
                </div>
              )}

              {/* Main content container */}
              <div className="card main-content">
                <MainContentData
                  selectedCondition={selectedCondition}
                  isPhenotypeVisible={isPhenotypeVisible}
                  submittedData={submittedData}
                  setSubmittedData={setSubmittedData}
                  handleSeverityClick={handleSeverityClick}
                  handleSeveritySubmit={handleSeveritySubmit}
                  RenderTabViewContent={RenderTabViewContent}
                  selectedPatient={selectedPatient}
                  aiScore={aiScore}
                  reason={reason}
                  setAiScore={setAiScore}
                  setReason={setReason}
                />
              </div>

              {/* Phenotype container */}
              <div className="card phenotype-section">
                <Phenotype
                  isPhenotypeVisible={isPhenotypeVisible}
                  selectedPatient={selectedPatient}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
