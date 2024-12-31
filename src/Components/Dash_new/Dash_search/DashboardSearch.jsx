import React, { useState } from 'react';
import './DashboardSearch.css';

const DashboardSearch = ({ patients }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);

    const handleSearch = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            const results = patients.filter(patient =>
                patient.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredPatients(results);
        } else {
            setFilteredPatients([]);
        }
    };

    const handleSelect = (patient) => {
        setSelectedPatient(patient);
        setSearchQuery('');
        setFilteredPatients([]);
    };

    return (
        <div className="dashboard-search">
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearch}
                className="dashboard-search-input"
            />
            <i className="pi pi-search dashboard-search-icon"></i>
            
            {selectedPatient && (
                <span className="selected-patient">
                    {selectedPatient} is selected
                </span>
            )}

            {filteredPatients.length > 0 && (
                <ul className="search-results">
                    {filteredPatients.map((patient, index) => (
                        <li
                            key={index}
                            onClick={() => handleSelect(patient)}
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
