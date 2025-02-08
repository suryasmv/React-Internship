import pandas as pd
import json

# Load the Excel file
file_path = "M:/Kavya Project/Full Project/Backend/patient_files/scoring_charts/KHAIGHGPTTL569_Scoring_chart.xlsx"
df = pd.read_excel(file_path)

# Strip spaces from column names
df.columns = df.columns.str.strip()

# Dictionary to store results
conditions_dict = {}

# Iterate over all columns starting from the 2nd column (index 1)
for col in df.columns[1:]:  
    # Check if column has at least one "Y"
    if (df[col] == 'Y').any():
        conditions_dict[col] = "Condition met"  # You can modify the value as needed

# Convert dictionary to JSON
json_output = json.dumps(conditions_dict, indent=4)

# Print the JSON output
print(json_output)

# Save JSON output to a file
output_path = "filtered_conditions.json"
with open(output_path, "w") as json_file:
    json_file.write(json_output)

print(f"\n✅ Filtered JSON saved successfully at: {output_path}")
