import os
import fnmatch
from flask import Flask, jsonify
from flask_cors import CORS
from Dashboard.search_bar_names import get_excel_file_names
from Dashboard.display_data import extract_patient_data
from Dashboard.patient_MainData import extract_patient_data2
from Dashboard.pheno_files import find_pdf_files
from flask import Flask, send_file, abort
import pandas as pd

app = Flask(__name__)
CORS(app)  # This allows all origins by default

mapping_dict = {
    "Diabetes": "Diabetes",
    "High Blood pressure": "High_Blood_Pressure",
    "Coronary Artery Disease": "Cardiac_Health",
    "Arrhythmia": "Cardiac_Health",
    "Heart Failure- Dilated Cardiomyopathy, Restrictive Cardiomyopathy": "Cardiac_Health",
    "Cholesterol disorders": "Cholesterol_Disorders",
    "Hypertriglyceridemia": "Cholesterol_Disorders",
    "Thyroid Disorders- Hypothyroidism, Hyperthyroidism": "Thyroid_Disorders",
    "Anemia- Microcytic, Hemolytic": "Anemia",
    "Predisposition to Blood clots- Thrombophilia": "Cardiac_Health",
    "Bleeding Disorders": "Cardiac_Health",
    "Parkinson’s Disease": "Parkinsons",
    "Alzheimer’s Disease": "Dementia",
    "Migraines, Headaches": "Headaches",
    "Seizures": "Neurological_Health",
    "Inflammatory bowel disease- Crohn’s, Ulcerative colitis": "Gut_Health",
    "Respiratory Allergies": "Allergies",
    "Food Allergies": "Allergies",
    "Liver Disorders": "Fatty_Liver",
    "Gall bladder disorders": "Gall_Stones",
    "Pancreatic Disorders": "Pancreatic_Disorders",
    "Nephrotic Syndrome (Focal Segmental Glomerulosclerosis, Membranous nephropathy, Minimal Change Disease)": "Glomerular_Diseases",
    "Interstitial Nephritis, Tubulo interstitial Disease": "Interstitial_Nephritis",
    "Renal Stones- Calcium Oxalate stones, Cystine stones, Uric Acid Stones": "Renal_Stones",
    "Dry skin, eczema": "Skin_Health",
    "Skin Allergies": "Skin_Health",
    "Vitiligo": "Skin_Health",
    "Osteoporosis": "Bone_Joint_Health",
    "Degenerative Joint Disease, Cartilage degeneration": "Arthritis_Degenerative_Joint",
    "Muscular dystrophy, atrophy": "Muscular_Health",
    "Fatigue": "Mood_Disorders",
    "Mood Disorders- Anxiety, Schizophrenia, Depression": "Mood_Disorders",
    "Urticaria": "Allergies",
    "Essential tremors": "Neurological_Health",
    "Renal Disorders": "Glomerular_Diseases",
    "Sinusitis, Dust Allergy (Ciliary dykinesia, Hyper IgE syndrome, Angioedma, Chronic granulomatous)": "Allergies",
    "Obesity": "Obesity",
    "Skin Health": "Skin_Health",
    "Eye Health": "Neurological_Health",
    "Gastritis": "Gastritis"
}

# Define the base directory
BASE_DIR = r"M:\Kavya Project\Full Project\Backend\patient_files"

# Define the pattern to search for
file_pattern = "*.xlsx"

@app.route('/patient_files/<patient_id>/<file_type>', methods=['GET'])
def serve_patient_file(patient_id, file_type):
    # Define the base directory where patient files are stored
    base_dir = r'M:\Kavya Project\Full Project\Backend\patient_files'
    
    # Map file types to their corresponding filenames
    file_map = {
        'pdf': f'{patient_id}.pdf',
        'consent': f'{patient_id}_consent.pdf',
        'blood_reports': f'{patient_id}_Blood_Reports.pdf'
    }
    
    # Check if the requested file type exists in the map
    if file_type in file_map:
        # Construct the full file path
        file_path = os.path.join(base_dir, patient_id, file_map[file_type])
        
        # Check if the file exists
        if os.path.exists(file_path):
            return send_file(file_path, mimetype='application/pdf')
        else:
            # Return a 404 error if the file does not exist
            abort(404, description="File not found")
    else:
        # Return a 400 error if the file type is invalid
        abort(400, description="Invalid file type")

@app.route('/get_patient_conditions/<patient_id>', methods=['GET'])
def get_patient_conditions(patient_id):
    # Define the file path with patient_id in front of '_ai'
    file_path = f"M:/Kavya Project/Full Project/Backend/ai_score/{patient_id}_ai.xlsx"
    
    try:
        # Load the Excel file
        df = pd.read_excel(file_path)

        # Print column names to check
        print("Columns in the file:", df.columns)  # This will print column names to the console

        # Apply the mapping dictionary to map 'Medical Condition' to categories
        df["Mapped_Category"] = df["Medical Condition"].map(mapping_dict)

        # Filter out rows where Mapped_Category is NaN (in case there are conditions not in the mapping dictionary)
        df = df.dropna(subset=["Mapped_Category"])

        # Return the data as a key-value pair where the key is 'Mapped_Category' and value is 'Ai score'
        result = df.set_index("Mapped_Category")["Ai score"].to_dict()

        return jsonify(result)

    except Exception as e:
        return jsonify({"error": f"Error occurred: {str(e)}"}), 500

# Function to search for files
def find_patient_files(base_dir, pattern):
    matching_files = []
    for root, dirs, files in os.walk(base_dir):
        for filename in fnmatch.filter(files, pattern):
            matching_files.append(os.path.join(root, filename))
    return matching_files

# Assign the matching files to EXCEL_FILES_DIR
EXCEL_FILES_DIR = find_patient_files(BASE_DIR, file_pattern)

@app.route('/get-file-names', methods=['GET'])
def get_file_names():
    """
    Endpoint to get Excel file names from the specified directory.
    """
    file_names = get_excel_file_names(EXCEL_FILES_DIR)
    print(file_names)
    return jsonify({'file_names': file_names})

@app.route('/get-patient-data', methods=['GET'])
def get_patient_data():
    """
    Route to fetch patient data from all Excel files in all patient subfolders.
    """
    try:
        # Extract data from the patient files
        data = extract_patient_data(EXCEL_FILES_DIR)
        return jsonify(data)
    except Exception as e:
        # Handle errors gracefully
        return jsonify({"error": str(e)}), 500

@app.route('/get-patient-data2', methods=['GET'])
def get_patient_data2():
    """
    Endpoint to get patient data from Excel files.
    """
    if not EXCEL_FILES_DIR:
        return jsonify({"error": "No Excel files found in the directory"}), 404

    try:
        data = extract_patient_data2(EXCEL_FILES_DIR)  # Pass the list of Excel files to the function
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
