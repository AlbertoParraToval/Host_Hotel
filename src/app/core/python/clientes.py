import os
import pandas as pd
import json

# Get the full path of the "clientes.json" file
path_clients = os.path.join(os.path.dirname(__file__), '')
path_clients_json = os.path.join(path_clients, 'clientes.json')
path_clients_csv = os.path.join(path_clients, 'clientes.csv')

# Load the clients JSON file into a list of clients
with open(path_clients_json, encoding='utf-8') as file:
    data = json.load(file)

# Create a list to store the clients' data
clientes_data = []

# Iterate over the clients and extract their data
for cliente in data:
    cliente_data = {
        "docId": cliente["docId"],
        "first_name": cliente["first_name"],
        "last_name": cliente["last_name"],
        "admin": cliente["admin"],
        "username": cliente["username"],
        "email": cliente["email"],
        "profilePick": cliente["profilePick"]
        # Add more fields if necessary
    }
    clientes_data.append(cliente_data)

# Create a DataFrame for the clients
clientes_df = pd.DataFrame(clientes_data)

# Save the DataFrame to the CSV file with special characters
clientes_df.to_csv(path_clients_csv, index=False, header=True, encoding='utf-8-sig')

print("CSV file 'clientes.csv' created successfully.")
