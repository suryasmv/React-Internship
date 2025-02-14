import os
import fnmatch
import json

def find_patient_files(base_dir, pattern="*.xlsx"):
    """
    Search for patient files within batch directories (including nested subfolders).
    Returns a dictionary with batch names as keys and patient names as values.
    """
    batch_dict = {}

    for root, dirs, files in os.walk(base_dir):
        # Extract the batch name (first level folder inside base_dir)
        relative_path = os.path.relpath(root, base_dir)
        batch_name = relative_path.split(os.sep)[0]  # Get the first folder name (BATCH1, BATCH2, etc.)

        if batch_name.upper().startswith("BATCH"):  # Ensure it’s a batch folder
            if batch_name not in batch_dict:
                batch_dict[batch_name] = []

            # Debugging: Check files in each folder
            print(f"Checking folder: {root}, Files: {files}")

            for filename in fnmatch.filter(files, pattern):
                patient_name = os.path.splitext(filename)[0]  # Remove extension
                batch_dict[batch_name].append(patient_name)  # Add patient name

    return batch_dict

def get_patient_json(base_dir):
    """
    Fetch batch-wise patient data and return as JSON string.
    """
    batch_data = find_patient_files(base_dir)
    return json.dumps(batch_data, indent=4)

if __name__ == "__main__":
    BASE_DIR = r"M:\Kavya Project\React-Internship\Backend\patient_files"
    print(get_patient_json(BASE_DIR))
