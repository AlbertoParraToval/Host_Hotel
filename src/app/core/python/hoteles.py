import os
import pandas as pd
import json

# Obtener la ruta completa del archivo "hoteles.json"
ruta_hoteles = os.path.join(os.path.dirname(__file__), '')
ruta_hoteles_json = os.path.join(ruta_hoteles, 'hoteles.json')
ruta_hoteles_csv = os.path.join(ruta_hoteles, 'hoteles.csv')

# Cargar el JSON de hoteles en una lista de hoteles
with open(ruta_hoteles_json, encoding='utf-8') as file:
    data = json.load(file)

# Crear una lista para almacenar los datos de los hoteles
hoteles_data = []

# Iterar sobre los hoteles y extraer sus datos
for hotel in data:
    hotel_data = {
        "docId": hotel["docId"],
        "name_hotel": hotel["name_hotel"],
        "localtion_hotel": hotel["localtion_hotel"],
        "url_img": hotel["url_img"],
        "street_hotel": hotel["street_hotel"],
        "info_hotel": hotel["info_hotel"]
        # Agrega más campos si es necesario
    }
    hoteles_data.append(hotel_data)

# Crear DataFrame para los hoteles
hoteles_df = pd.DataFrame(hoteles_data)

# Guardar el DataFrame en el archivo CSV con caracteres especiales
hoteles_df.to_csv(ruta_hoteles_csv, index=False, header=True, encoding='utf-8-sig')

print("Archivo CSV de hoteles creado con éxito.")