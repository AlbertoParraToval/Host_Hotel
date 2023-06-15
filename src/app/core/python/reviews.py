import os
import pandas as pd
import json

# Get the full path of the "reviews.json" file
ruta_reviews = os.path.join(os.path.dirname(__file__), '')
ruta_reviews_json = os.path.join(ruta_reviews, 'reviews.json')
ruta_reviews_csv = os.path.join(ruta_reviews, 'reviews.csv')

# Load the JSON file into a list of reviews
with open(ruta_reviews_json, encoding='utf-8') as file:
    data = json.load(file)

# Create a list to store the reviews' data
reviews_data = []

# Iterate over the reviews and extract their data
for review in data:
    review_data = {
        "docId": review["docId"],
        "id_user": review["id_user"],
        "id_hoteles": review["id_hoteles"],
        "fecha": review["fecha"],
        "rating": review["rating"],
        "text_review": review["text_review"]
    }
    reviews_data.append(review_data)

# Create a DataFrame for the reviews
reviews_df = pd.DataFrame(reviews_data)

# Save the DataFrame to the CSV file with special characters
reviews_df.to_csv(ruta_reviews_csv, index=False, header=True, encoding='utf-8-sig')

print("CSV file 'reviews.csv' created successfully.")
