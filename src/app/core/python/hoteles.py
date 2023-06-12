import os
import pandas as pd
import json
from collections import OrderedDict

# Obtener la ruta completa del archivo "hoteles.json"
ruta_datos = os.path.join(os.path.dirname(__file__), '')
ruta_hoteles_json = os.path.join(ruta_datos, 'hoteles.json')
ruta_hoteles_csv = os.path.join(ruta_datos, 'hoteles.csv')

# Cargar el JSON de hoteles en una lista con OrderedDict
with open(ruta_hoteles_json) as file:
    data = json.load(file, object_pairs_hook=OrderedDict)

# Crear una lista para almacenar los datos de los hoteles
hoteles_data = []

# Iterar sobre los hoteles y extraer los datos
for hotel in data:
    nombre_hotel = hotel.get("name_hotel")
    ubicacion_hotel = hotel.get("localtion_hotel").replace("Ã³", "ó")
    url_imagen = hotel.get("url_img")
    info_hotel = hotel.get("info_hotel")

    hotel_data = {
        "name_hotel": nombre_hotel,
        "localtion_hotel": ubicacion_hotel,
        "url_img": url_imagen,
        "info_hotel": info_hotel
    }

    hoteles_data.append(hotel_data)

# Crear DataFrame para los hoteles
hoteles_df = pd.DataFrame(hoteles_data)

# Guardar el DataFrame en el archivo CSV
hoteles_df.to_csv(ruta_hoteles_csv, index=False, encoding='utf-8', sep=',')

print("Archivo CSV creado.")
