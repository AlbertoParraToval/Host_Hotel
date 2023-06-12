import os
import pandas as pd
import json

# Obtener la ruta completa del archivo "hoteles.json"
ruta_hoteles = os.path.join(os.path.dirname(__file__), '')
ruta_hoteles_json = os.path.join(ruta_hoteles, 'hoteles.json')
ruta_hoteles_csv = os.path.join(ruta_hoteles, 'hoteles.csv')

# Cargar el JSON en una lista de hoteles
with open(ruta_hoteles_json) as file:
    data = json.load(file)

# Crear una lista para almacenar los datos de los hoteles
hoteles_data = []

# Iterar sobre los hoteles y extraer sus datos sin incluir el campo "id"
for hotel in data:
    hotel_data = {}
    for key, value in hotel.items():
        if key != "id":
            hotel_data[key] = value
    hoteles_data.append(hotel_data)

# Crear DataFrame para los hoteles
hoteles_df = pd.DataFrame(hoteles_data)

# Guardar el DataFrame en el archivo CSV
hoteles_df.to_csv(ruta_hoteles_csv, index=False, header=True)

print("Archivo CSV de hoteles creado con éxito.")
