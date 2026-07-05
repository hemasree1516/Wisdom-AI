import json
import os
from supabase import create_client, Client

# --- 1. PASTE YOUR KEYS HERE ---
# Get these from Supabase -> Project Settings -> Data API
url = "https://fcqgirluhzdmfovrxygd.supabase.co" 
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjcWdpcmx1aHpkbWZvdnJ4eWdkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNTg0MzUsImV4cCI6MjA5MDYzNDQzNX0.uqMzBpiRtA1tA-NB9w73dDv-bZ-iENI82hv3oT-S_q8" 

supabase: Client = create_client(url, key)

# --- 2. LOAD YOUR DATA ---
file_name = 'final_wisdom_data.json'

if not os.path.exists(file_name):
    print(f"ERROR: {file_name} not found! Run 'python process_vectors.py' first.")
else:
    with open(file_name, 'r') as f:
        data = json.load(f)

    print(f"Found {len(data)} stories. Starting upload to Supabase...")

    # --- 3. FORMAT AND UPLOAD ---
    formatted_data = []
    for row in data:
        formatted_data.append({
            "source_text": row.get("source_text"),
            "character_name": row.get("character"),
            "situation": row.get("situation"),
            "moral_conflict": row.get("moral_conflict"),
            "short_verse": row.get("short_verse", "Seek wisdom within."),
            "hope_message": row.get("hope_message"),
            "embedding": row.get("embedding") # This is the AI math
        })

    # Upload in batches so it doesn't crash
    batch_size = 50
    for i in range(0, len(formatted_data), batch_size):
        batch = formatted_data[i : i + batch_size]
        try:
            supabase.table('stories').insert(batch).execute()
            print(f"Successfully uploaded rows {i} to {i + len(batch)}")
        except Exception as e:
            print(f"Error at row {i}: {e}")

    print("\nSUCCESS! Your database is now full of wisdom.")