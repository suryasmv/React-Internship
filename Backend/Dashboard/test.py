import json
import os
import pandas as pd
import numpy as np  # Required for NaN

# Define the folder path (replace with the actual folder containing your Excel files)
folder_path = r"M:\Kavya Project\Full Project\Backend\GH_Files\patient_files"  # Example folder for Excel files

# Define the function to extract patient data
def extract_patient_data(folder_path):
    """
    Extracts data from Excel files and converts it into a JSON structure under the "conditions" key.
    Includes patient file names as the first item in the "conditions" list.

    Args:
        folder_path (str): Path to the folder containing Excel files.

    Returns:
        dict: JSON object containing all patient data under the "conditions" key, including file names.
    """
    result = {}

    # Iterate through all Excel files in the folder
    for file_name in os.listdir(folder_path):
        if file_name.endswith('.xlsx') or file_name.endswith('.xls'):
            file_path = os.path.join(folder_path, file_name)
            
            # Load the Excel file
            excel_data = pd.ExcelFile(file_path)

            # Create an entry for the patient (patient name will be the key)
            patient_data = {
                "subcategories": []
            }

            # Iterate through all sheets in the Excel file
            for sheet_name in excel_data.sheet_names:
                print(f"Processing sheet: {sheet_name}")  # Debugging print

                sheet_data = excel_data.parse(sheet_name)

                # Print the actual columns in the sheet to debug
                print(f"Columns in sheet '{sheet_name}': {sheet_data.columns.tolist()}")  # Debugging print

                # Normalize column names to handle case sensitivity and leading/trailing spaces
                sheet_data.columns = sheet_data.columns.str.strip().str.lower()

                # Ensure that 'Headings' and 'Condition' columns exist, even if missing
                if 'headings' not in sheet_data.columns:
                    sheet_data['headings'] = np.nan
                if 'condition' not in sheet_data.columns:
                    sheet_data['condition'] = np.nan

                subcategories = []

                # Group data by 'headings' and extract unique conditions
                for heading, group in sheet_data.groupby('headings'):
                    subcategory = {
                        "name": heading if pd.notna(heading) else "Unknown",
                        "subtype": [{"name": cond} for cond in group['condition'].dropna().unique()]
                    }
                    subcategories.append(subcategory)

                # Add subcategories to the patient's data
                if subcategories:
                    patient_data["subcategories"].append({
                        "icon": f"Icons/{sheet_name.replace(' ', '')} Icon.png",
                        "name": sheet_name,
                        "subcategories": subcategories
                    })

            # Add the patient's data to the result if subcategories exist
            if patient_data["subcategories"]:
                result[file_name] = patient_data

                # Debugging print to check if the data is being added to the result
                print(f"Added data for patient: {file_name}")
            else:
                print(f"No subcategories found for patient: {file_name}")

    # Wrap the result in a dictionary under the "conditions" key
    return {"conditions": result}

# Extract the patient data
patient_data = extract_patient_data(folder_path)

# Debugging print to check the final result before writing to file
print(f"Final Data: {json.dumps(patient_data, indent=4)}")

# Define the JSON file path for saving the data
output_json_path = r"M:\Kavya Project\Full Project\Backend\Dashboard\test.json"

# Save the extracted data as a JSON file
with open(output_json_path, 'w') as json_file:
    json.dump(patient_data, json_file, indent=4)

# Confirm the output path
print(f"JSON file saved at: {output_json_path}")

output_json_path
