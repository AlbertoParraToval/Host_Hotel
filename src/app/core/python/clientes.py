import os
import pandas as pd
import json

# Obtener la ruta completa del archivo "clientes.json"
ruta_clientes = os.path.join(os.path.dirname(__file__), '')
ruta_clientes_json = os.path.join(ruta_clientes, 'clientes.json')
ruta_clientes_csv = os.path.join(ruta_clientes, 'clientes.csv')

# Cargar el JSON de clientes en una lista de clientes
with open(ruta_clientes_json, encoding='utf-8') as file:
    data = json.load(file)

# Crear una lista para almacenar los datos de los clientes
clientes_data = []

# Iterar sobre los clientes y extraer sus datos
for cliente in data:
    cliente_data = {
        "docId": cliente["docId"],
        "first_name": cliente["first_name"],
        "last_name": cliente["last_name"],
        "admin": cliente["admin"],
        "username": cliente["username"],
        "email": cliente["email"],
        "profilePick": cliente["profilePick"]
        # Agrega más campos si es necesario
    }
    clientes_data.append(cliente_data)

# Crear DataFrame para los clientes
clientes_df = pd.DataFrame(clientes_data)

# Guardar el DataFrame en el archivo CSV con caracteres especiales
clientes_df.to_csv(ruta_clientes_csv, index=False, header=True, encoding='utf-8-sig')

print("Archivo CSV de clientes creado con éxito.")
