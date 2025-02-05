import pandas as pd
import os

def extract_patient_data2(file_paths):
    """
    Extracts patient data from all Excel files and returns it as a dictionary with patient names.
    Args:
        file_paths (list): List of full file paths to the Excel files.
    Returns:
        dict: A dictionary where patient file names are keys and their corresponding data is the value.
    """
    all_json_data = {}

    # Iterate through all Excel files in the list of file paths
    for file_path in file_paths:
        if os.path.exists(file_path):  # Check if the file exists
            file_name = os.path.basename(file_path)
            excel_data = pd.ExcelFile(file_path)

            # Prepare a structure for the patient data
            patient_data = {
                "conditions": []
            }

            # Iterate over each sheet in the Excel file
            for sheet_name in excel_data.sheet_names:
                df = excel_data.parse(sheet_name)

                # Ensure consistent column names (replace spaces with underscores)
                df.columns = [' '.join(col.split('_')) for col in df.columns]

                # Check if the sheet name contains "Pathogenic Variants" or "Conflicting Variants"
                special_condition = "Pathogenic Variants" in sheet_name or "Conflicting Variants" in sheet_name

                # Iterate over each row in the DataFrame
                for _, row in df.iterrows():
                    # Determine the correct "Gene Name" value based on the condition
                    gene_name = (
                        row.get("Gene Name", None) if special_condition 
                        else row.get("Gene", None)
                    )
                    # Ensure consistency for NaN handling
                    gene_name = gene_name if pd.notna(gene_name) else "NaN"

                    # Build the JSON object
                    json_object = {
                        "Condition": sheet_name if special_condition else (row.get("Condition", None) if pd.notna(row.get("Condition", None)) else "NaN"),
                        "Headings": sheet_name if special_condition else (row.get("Headings", None) if pd.notna(row.get("Headings", None)) else "NaN"),
                        "subtype_cond": sheet_name,
                        "Gene Name": gene_name,  # Use the determined Gene Name
                        "Gene": row.get("Gene", None) if pd.notna(row.get("Gene", None)) else "NaN",
                        "Gene Score": row.get("Gene Score", None) if pd.notna(row.get("Gene Score", None)) else "NaN",
                        "rsID": row.get("rsID", None) if pd.notna(row.get("rsID", None)) else "NaN",
                        "Lit": row.get("Literature", None) if pd.notna(row.get("Literature", None)) else "NaN",
                        "CH": row.get("CHROM", None) if pd.notna(row.get("CHROM", None)) else "NaN",
                        "POS": row.get("POS", None) if pd.notna(row.get("POS", None)) else "NaN",
                        "ref": row.get("REF", None) if pd.notna(row.get("REF", None)) else "NaN",
                        "alt": row.get("ALT", None) if pd.notna(row.get("ALT", None)) else "NaN",
                        "Zygosity": row.get("Zygosity", None) if pd.notna(row.get("Zygosity", None)) else "NaN",
                        "Consequence": row.get("Consequence", None) if pd.notna(row.get("Consequence", None)) else "NaN",
                        "Conseq score": row.get("Consequence score", None) if pd.notna(row.get("Consequence score", None)) else "NaN",
                        "IMPACT": row.get("IMPACT", None) if pd.notna(row.get("IMPACT", None)) else "NaN",
                        "IMPACT score": row.get("IMPACT score", None) if pd.notna(row.get("IMPACT score", None)) else "NaN",
                        "ClinVar CLNDN": row.get("ClinVar CLNDN", None) if pd.notna(row.get("ClinVar CLNDN", None)) else "NaN",
                        "Clinical consequence": row.get("Clinical consequence", None) if pd.notna(row.get("Clinical consequence", None)) else "NaN",
                        "clin sig": row.get("ClinVar CLNSIG", None) if pd.notna(row.get("ClinVar CLNSIG", None)) else "NaN",
                        "Variant type": row.get("Variant type", None) if pd.notna(row.get("Variant type", None)) else "NaN"
                    }
                    # Add the condition data to the patient's list of conditions
                    patient_data["conditions"].append(json_object)

            # Once the patient's data is processed, add it to the dictionary with the patient name as the key
            all_json_data[file_name] = patient_data
            print(f"Processed file: {file_name}")

    return all_json_data
