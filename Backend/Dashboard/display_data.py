import os
import pandas as pd

def extract_patient_data(file_paths):
    """
    Extracts data from Excel files and converts it into a JSON structure under the "conditions" key.
    Includes patient file names as the first item in the "conditions" list.

    Args:
        file_paths (list): List of full file paths to the Excel files.

    Returns:
        dict: JSON object containing all patient data under the "conditions" key, including file names.
    """
    result = {}

    # Iterate through all Excel files in the list of file paths
    for file_path in file_paths:
        if file_path.endswith('.xlsx') or file_path.endswith('.xls'):
            file_name = os.path.basename(file_path)
            
            # Load the Excel file
            excel_data = pd.ExcelFile(file_path)

            # Create an entry for the patient (patient name will be the key)
            patient_data = {
                "subcategories": []
            }

            # Iterate through all sheets in the Excel file
            for sheet_name in excel_data.sheet_names:
                sheet_data = excel_data.parse(sheet_name)

                # Special handling for "Pathogenic Variant" and "Conflicting" sheets
                if sheet_name.lower() in ["pathogenic variants", "conflicting variants"]:
                    patient_data["subcategories"].append({
                        "icon": f"Icons/{sheet_name.replace(' ', '')} Icon.png",
                        "name": sheet_name,
                        "subcategories": [
                            {
                                "name": sheet_name,
                                "subtype": [
                                    {
                                        "name": sheet_name
                                    }
                                ]
                            }
                        ]
                    })

                else:
                    # Ensure required columns exist
                    if 'Headings' in sheet_data.columns and 'Condition' in sheet_data.columns:
                        subcategories = []

                        # Group data by 'Headings' and extract unique conditions
                        for heading, group in sheet_data.groupby('Headings'):
                            subcategory = {
                                "name": heading,
                                "subtype": [{"name": cond} for cond in group['Condition'].dropna().unique()]
                            }
                            subcategories.append(subcategory)

                        # Add subcategories to the patient's data
                        patient_data["subcategories"].append({
                            "icon": f"Icons/{sheet_name.replace(' ', '')} Icon.png",
                            "name": sheet_name,
                            "subcategories": subcategories
                        })

            # Add the patient's data to the result if subcategories exist
            if patient_data["subcategories"]:
                result[file_name] = patient_data

    # Wrap the result in a dictionary under the "conditions" key
    return {"conditions": result}
