import React, { useState, useEffect } from "react";
import GoogleDrivePicker from "google-drive-picker";
import { Button } from 'primereact/button';
import removeIcon from './x.png'; // Import your PNG icon
import './Phenotype.css';
import { Navigate, SvgImage } from "../Libraries/Libraries";

function App() {
  const [authToken, setAuthToken] = useState("");
  const [openPicker, authRes] = GoogleDrivePicker({ viewMimeTypes: 'application/pdf' });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFileIndexes, setSelectedFileIndexes] = useState([]);
  const [goback, setogback] = useState(false);
  const [logout, setlogout] = useState(false);

  const handleOpenPicker = () => {
    openPicker({
      clientId: "495587796363-prf3o1372ce2e1bf67cflu7kn4h0hdrg.apps.googleusercontent.com",
      developerKey: "AIzaSyBTILom7XmvEx6UyVAztR4Kh4nkuiSjhSo",
      viewId: "FOLDERS" | "PDFS",
      token: authToken,
      showUploadView: false,
      showUploadFolders: false,
      supportDrives: true,
      viewMimeTypes: 'application/pdf',
      multiselect: true,
      customScopes: ['https://www.googleapis.com/auth/drive.readonly'],
      callbackFunction: (data) => {
        if (data.docs && data.docs.length > 0) {
          setSelectedFiles(data.docs);
          setSelectedFileIndexes(data.docs.map((_, index) => index)); // Set all selected file indexes
        } else if (data.action === 'cancel') {
          console.log('User clicked cancel/close button');
        }
      },
    });
  };

  useEffect(() => {
    if (authRes) {
      const accessToken = authRes.access_token;
      // Fetch user info to get email address
      fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          const userEmail = data.email;
          // Check if user email ends with "@genepowerx.com"
          if (userEmail && userEmail.endsWith("@genepowerx.com")) {
            setAuthToken(accessToken);
          } else {
            console.log("Access denied: User's email does not end with '@genepowerx.com'");
          }
        })
        .catch(error => console.error("Error fetching user info:", error));
    }
  }, [authRes]);

  if (goback) {
    return <Navigate to='/home' />;
  }

  const handlegoback = () => {
    setogback(true);
  };

  if (logout) {
    return <Navigate to="/" />;
  }

  const handleLogout = () => {
    // Clear authentication-related cookies
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "email=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    setlogout(true);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    const updatedIndexes = selectedFileIndexes.filter(i => i !== index);

    // Adjust indexes after removing a file
    setSelectedFiles(updatedFiles);
    setSelectedFileIndexes(updatedIndexes.map(i => (i > index ? i - 1 : i))); // Decrement index for remaining items
  };

  return (
    <div className="phenotype">
      <div className="navbar">
        <div className="user_img_pref">
          <Button label='Home' className='goback_button' onClick={handlegoback} />
          <Button label="Logout" onClick={handleLogout} />
        </div>
        <div className="doctor_navbar">
          <img src={SvgImage} alt='logo' />
        </div>
      </div>
      <div className='containerpdf'>
        <div className='open_picker'>
          <Button onClick={() => handleOpenPicker()}>Open Phenotype Files</Button>
        </div>

        <div className='selected_files'>
          {selectedFiles.map((file, index) => (
            <div key={index} className="selectedfiles">
              {file.name}
              <span className="remove-icon" onClick={() => handleRemoveFile(index)}>
                <img src={removeIcon} alt="Remove" />
              </span>
            </div>
          ))}
        </div>

        <div className='pdf_viewers'>
          <div className='pdf_viewer'>
            {selectedFileIndexes.length === 1 ? (
              // If only one file is selected, display it full-width
              <iframe
                src={selectedFiles[selectedFileIndexes[0]]?.embedUrl}
                title={`PDF Viewer ${selectedFileIndexes[0]}`}
                width='100%'
                height='600px'
              />
            ) : (
              // If two files are selected, display them side by side
              selectedFileIndexes.map((index, viewerIndex) => (
                index !== null && (
                  <iframe
                    key={viewerIndex}
                    src={selectedFiles[index].embedUrl}
                    title={`PDF Viewer ${index}`}
                    width='50%'
                    height='600px'
                    style={{ float: "left" }}
                  />
                )
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
