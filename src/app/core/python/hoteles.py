import os
import pandas as pd
import json

# Get the full path of the "hoteles.json" file
path_hotels = os.path.join(os.path.dirname(__file__), '')
path_hotels_json = os.path.join(path_hotels, 'hoteles.json')
path_hotels_csv = os.path.join(path_hotels, 'hoteles.csv')

# Load the hotels JSON file into a list of hotels
with open(path_hotels_json, encoding='utf-8') as file:
    data = json.load(file)

# Create a list to store the hotels' data
hoteles_data = []

# Iterate over the hotels and extract their data
for hotel in data:
    hotel_data = {
        "docId": hotel["docId"],
        "name_hotel": hotel["name_hotel"],
        "localtion_hotel": hotel["localtion_hotel"],
        "url_img": hotel["url_img"],
        "street_hotel": hotel["street_hotel"],
        "info_hotel": hotel["info_hotel"]
        # Add more fields if necessary
    }
    hoteles_data.append(hotel_data)

# Create a DataFrame for the hotels
hoteles_df = pd.DataFrame(hoteles_data)

# Save the DataFrame to the CSV file with special characters
hoteles_df.to_csv(path_hotels_csv, index=False, header=True, encoding='utf-8-sig')

print("CSV file 'hoteles.csv' created successfully.")
