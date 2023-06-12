import os
import pandas as pd
import json
import csv

# Obtener la ruta completa del archivo "hoteles.json"
ruta_hoteles = os.path.join(os.path.dirname(__file__), '')
ruta_hoteles_json = os.path.join(ruta_hoteles, 'hoteles.json')
ruta_hoteles_csv = os.path.join(ruta_hoteles, 'hoteles.csv')

# Cargar el JSON en una lista de hoteles
with open(ruta_hoteles_json) as file:
    data = json.load(file)

# Crear una lista de diccionarios para almacenar los datos de cada atributo
nuevos_datos = []
for hotel in data:
    nuevo_hotel = {}
    for key, value in hotel.items():
        if key != "id":  # Excluir la columna "id"
            if isinstance(value, dict):
                # Si el valor es un diccionario, convertirlo a una cadena JSON
                nuevo_hotel[key] = json.dumps(value)
            else:
                # Si el valor no es un diccionario, convertirlo a cadena antes de la codificación
                nuevo_hotel[key] = str(value)
    nuevos_datos.append(nuevo_hotel)

# Crear DataFrame con los datos modificados
hoteles_df = pd.DataFrame(nuevos_datos)

# Guardar el DataFrame en el archivo CSV
hoteles_df.to_csv(ruta_hoteles_csv, index=False, quoting=csv.QUOTE_ALL, sep=',')

print("Archivo CSV de hoteles creado con éxito.")
