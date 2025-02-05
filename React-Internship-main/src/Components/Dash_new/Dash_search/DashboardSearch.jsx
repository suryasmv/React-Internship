import React, { useState, useEffect } from 'react';
import './DashboardSearch.css';

const DashboardSearch = ({ onSelectPatient }) => { // Receive onSelectPatient as a prop
    const [patients, setPatients] = useState([]); // State to hold the patients (file names)
    const [searchQuery, setSearchQuery] = useState(''); // State to hold the current search query
    const [filteredPatients, setFilteredPatients] = useState([]); // State to hold the filtered patients
    const [selectedPatient, setSelectedPatient] = useState(null); // State to hold the selected patient

    useEffect(() => {
        // Fetch data from the API
        const fetchPatients = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/get-file-names");
                if (!response.ok) {
                    throw new Error("Failed to fetch patients");
                }
                const data = await response.json(); // Assuming the API returns JSON
                if (data.file_names && Array.isArray(data.file_names)) {
                    setPatients(data.file_names); // Extracting and setting the file names array
                } else {
                    console.error("Invalid data format: Expected an array under 'file_names'");
                    setPatients([]); // Fallback to an empty array if the data format is incorrect
                }
            } catch (error) {
                console.error("Error fetching patients:", error);
                setPatients([]); // Fallback to an empty array in case of an error
            }
        };

        fetchPatients();
    }, []); // Empty dependency array means this runs once when the component mounts

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            const results = patients.filter(patient =>
                patient.toLowerCase().includes(query.toLowerCase()) // Filtering based on the search query
            );
            setFilteredPatients(results); // Set the filtered patients
        } else {
            setFilteredPatients([]); // Clear the filtered patients if the search query is empty
        }
    };

    const handleSelect = (patient) => {
        setSelectedPatient(patient); // Set the selected patient
        setSearchQuery(''); // Clear the search query
        setFilteredPatients([]); // Clear the filtered results
        onSelectPatient(patient); // Call the onSelectPatient function passed from the parent
    };

    return (
        <div className="dashboard-search">
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch} // Handle search input changes
                className="dashboard-search-input"
            />
            <i className="pi pi-search dashboard-search-icon"></i>

            {selectedPatient && (
                <span className="selected-patient">
                    {selectedPatient} is selected {/* Display selected patient */}
                </span>
            )}

            {filteredPatients.length > 0 && (
                <ul className="search-results">
                    {filteredPatients.map((patient, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(patient)} // Handle patient selection
                            className="search-result-item"
                        >
                            {patient}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DashboardSearch;