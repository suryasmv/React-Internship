import os

def get_excel_file_names(file_paths):
    """
    Get a list of Excel file names from the provided file paths.
    :param file_paths: List of full file paths to Excel files.
    :return: List of Excel file names.
    """
    return [os.path.basename(file)[:-5] if file.endswith('.xlsx') else os.path.basename(file) for file in file_paths]

