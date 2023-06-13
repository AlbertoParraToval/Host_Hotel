import os
import pandas as pd
import json

# Obtener la ruta completa del archivo "reviews.json"
ruta_reviews = os.path.join(os.path.dirname(__file__), '')
ruta_reviews_json = os.path.join(ruta_reviews, 'reviews.json')
ruta_reviews_csv = os.path.join(ruta_reviews, 'reviews.csv')

# Cargar el JSON en una lista de reseñas
with open(ruta_reviews_json, encoding='utf-8') as file:
    data = json.load(file)

# Crear una lista para almacenar los datos de las reseñas
reviews_data = []

# Iterar sobre las reseñas y extraer sus datos
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

# Crear DataFrame para las reseñas
reviews_df = pd.DataFrame(reviews_data)

# Guardar el DataFrame en el archivo CSV con caracteres especiales
reviews_df.to_csv(ruta_reviews_csv, index=False, header=True, encoding='utf-8-sig')

print("Archivo CSV de reseñas creado con éxito.")
