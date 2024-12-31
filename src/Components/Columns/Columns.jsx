/* eslint-disable */
import React, { useState, useEffect } from 'react';
import './Columns.css';
import { Navigate } from 'react-router-dom';
import { Checkbox } from 'primereact/checkbox';
import SvgImage from './headerLogo.svg';
import { Button } from 'primereact/button';
import image from './user.png'

const icons = {
    Default: "⚙️",
    "Population Frequencies": "📊",
    "Impact Information": "⚡",
    "ClinVar Information": "💼",
    "Protein Information": "🧬",
    "Genotype Information": "🧬",
    "Functional Prediction": "⚙️",
    "Additional Information": "➕",
    "gnomADe": "📊",
    "gnomADg": "📊"
};

const Options = {
    Default: ["rsID","Gene Name","Gene Score", "Lit", "CH", "POS", "ref", "alt", "Zygosity", "Consequence", "Conseq score", "clin sig"],
    "Population Frequencies": ["AFR_AF", "AMR_AF", "EAS_AF", "EUR_AF", "SAS_AF", "gnomADe_AF", "gnomADg_AF", "MAX_AF", "MAX_AF_POPS"],
    "Impact Information": ["IMPACT", "IMPACT_score"],
    "ClinVar Information": ["ClinVar_CLNDN", "ClinVar_CLNREVSTAT", "ClinVar"],
    "Protein Information": ["HGVSc", "HGVSc (Transcript)", "HGVSp", "HGVSp (Transcript)"],
    "Genotype Information": ["GT", "GQ", "SDP", "DP", "RD", "AD", "FREQ", "PVAL", "RDF", "RDR", "ADF", "ADR"],
    "Functional Prediction": ["SIFT", "PolyPhen"],
    "Additional Information": ["BIOTYPE", "EXON", "INTRON", "Protein Position and Amino Acid", "Codons", "STRAND", "PUBMED"],
    "gnomADe": ["gnomADe_AFR_AF", "gnomADe_AMR_AF", "gnomADe_ASJ_AF", "gnomADe_EAS_AF", "gnomADe_FIN_AF", "gnomADe_NFE_AF", "gnomADe_OTH_AF", "gnomADe_SAS_AF"],
    "gnomADg": ["gnomADg_AFR_AF", "gnomADg_AMI_AF", "gnomADg_ASJ_AF", "gnomADg_EAS_AF", "gnomADg_FIN_AF", "gnomADg_MID_AF", "gnomADg_NFE_AF", "gnomADg_OTH_AF", "gnomADg_SAS_AF"],
};

const Columns = () => {
    const [gotoConditions,setgotoConditions]=useState(false)
    const [selectedHeading, setSelectedHeading] = useState("Default");
    const [selectedItems, setSelectedItems] = useState(Options["Default"]);
    const [searchInput, setSearchInput] = useState('');
    const [gobacktoConditons,setgobacktoCondtions]=useState(false);
    const [logout,setlogout]=useState(false);

    const handleHeadingClick = (heading) => {
        setSelectedHeading(heading);
    };

    useEffect(() => {
        setSelectedItems(Options["Default"]);
    }, []);

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    };

    const handleRemoveItem = (itemToRemove) => {
        setSelectedItems(selectedItems.filter(item => item !== itemToRemove));
    };

    const handleFormSubmit = () => {
        // Store selectedItems in local storage
        localStorage.setItem('selectedColumns', JSON.stringify(selectedItems));
        setgotoConditions(true)
    };
    
    if(gotoConditions)
    {
        return <Navigate to='/dashboard'/>
    }
    if(gobacktoConditons)
    {
        return <Navigate to='/conditions'/>
    }
    const handleGoback=()=>{
        setgobacktoCondtions(true);
    }
    const filteredItems = Options[selectedHeading].filter(item =>
        item.toLowerCase().includes(searchInput.toLowerCase())
    );
    if(logout)
    {
      return <Navigate to="/" />;
    }
    const handleLogout = () => {
        // Clear authentication-related cookies
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    
        // Redirect to login page
        setlogout(true);
      };
    return (
        <div className='bg'>
            <div className="user_img_col">
       
          <Button label='Conditions' onClick={handleGoback} className='gobackcol' />
          <Button label="Logout" onClick={handleLogout}/>
        </div>
            <div className="navbar">
                <img src={SvgImage} alt='logo' />
                <div className='select_columns'>
                    <h1 className='select_columns'>Select columns you want </h1>
                </div>
            </div>
            <div className='Col'>
                <div className='card'>
                    <div className='searching'>
                        <span className="p-input-icon-right">
                            <input type="search" name="" id="" placeholder='Search here' className='search' value={searchInput} onChange={handleSearch} />
                        </span>
                        <Button className='columns_submit' onClick={handleFormSubmit}>Submit</Button>

                    </div>
                    <div style={{ display: 'flex' }}>
                        <div className='Side_list' >
                            {Object.keys(Options).map((heading) => (
                                <div key={heading} onClick={() => handleHeadingClick(heading)} className="head_Selection" style={{ cursor: 'pointer' }}>
                                    {icons[heading]} {heading}
                                </div>
                            ))}
                        </div>

                        <div className='list_col'>
                            <ul>
                                {filteredItems.map((item) => (
                                    <li key={item}>
                                        <label>
                                            <Checkbox value={item} checked={selectedItems.includes(item)} onChange={(e) => {
                                                const checked = e.checked;
                                                if (checked) {
                                                    setSelectedItems([...selectedItems, item]);
                                                } else {
                                                    setSelectedItems(selectedItems.filter(selectedItem => selectedItem !== item));
                                                }
                                            }} />
                                            &nbsp; &nbsp; 
                                            {item}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className='selected_card'>
                            <div className='selected_columns'>Selected columns:</div>
                            <ul>
                                {selectedItems.map((item, index) => (
                                    <li key={index}>
                                        {item}
                                        <span
                                            className="remove-icon"
                                            onClick={() => handleRemoveItem(item)}
                                        >
                                            &#10006;
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Columns;
