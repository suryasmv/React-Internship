import os

def find_pdf_files(folder_path):
    """
    Searches for PDF files in the specified folder and returns a list of file paths.

    Args:
        folder_path (str): Path to the directory to search for PDF files.

    Returns:
        list: A list of paths to PDF files found in the directory.
    """
    pdf_files = []
    
    # Iterate through all files and subdirectories in the given folder
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.endswith(".pdf"):
                pdf_files.append(os.path.join(root, file))

    return pdf_files
