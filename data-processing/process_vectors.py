import pandas as pd
from sentence_transformers import SentenceTransformer
import json
import os

# 1. Load the model (This downloads a small model to your PC for free)
print("Loading AI model... this might take a moment the first time.")
model = SentenceTransformer('all-MiniLM-L6-v2')

# 2. Check for your CSV file
# IMPORTANT: Ensure your 600-row file is in 'data-processing' and named stories.csv
csv_path = 'stories.csv' 

if not os.path.exists(csv_path):
    print(f"ERROR: Could not find {csv_path} in the data-processing folder.")
    print("ACTION: Copy your CSV into 'data-processing' and rename it to stories.csv")
else:
    # 3. Load the data
    df = pd.read_csv(csv_path)

    # 4. Prepare text for the AI to "read"
    # We combine situation and moral conflict for deeper understanding
    df['search_context'] = df['situation'].astype(str) + " " + df['moral_conflict'].astype(str)

    # 5. Generate Vectors (The mathematical representation of feelings)
    print(f"Generating vectors for {len(df)} rows. Please wait...")
    embeddings = model.encode(df['search_context'].tolist(), show_progress_bar=True)

    # 6. Add the vectors to the dataframe
    df['embedding'] = embeddings.tolist()

    # 7. Save as JSON (This is the best format for Supabase/Web Apps)
    output_file = 'final_wisdom_data.json'
    df.to_json(output_file, orient='records', indent=4)
    print(f"\nSUCCESS! Created {output_file}")
    print("You can now see 'final_wisdom_data.json' in your sidebar.")