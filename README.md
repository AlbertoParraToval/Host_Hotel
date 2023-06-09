# HostHotel
![icono](https://user-images.githubusercontent.com/91873665/230318864-81f453b8-6dcb-43c4-9aef-65478e0e363a.png)

## Desarrolladores
- Alberto Parra Toval, Híbrido.
- Sergio Morales García, Nativo.

## Descripción
HotelHost es una app de valoración de hoteles de una misma cadena en España, para ello haremos que la lista de hoteles disponible se filtre por comunidades autónomas.
Esta App tiene dos modos de verla, el primero modo administrador donde el administrador podrá editar, modificar y añadir los hoteles de su cadena de hoteles de manera personalizada. Además el administrador podrá ver todas las reseñas y poder borrar, editarlas por si hay alguna falta de respeto hacia el hotel correspondiente. Es decir se aceptan críticas pero con cabeza y educación.

Por otro lado el modo cliente donde, el usuario podrá buscar el hotel donde ha estado para dejar su reseña de manera gratuita y así ayudar a otros usuarios para encontrar el hotel ideal para sus vacaciones.

A modo de que el profesorado tenga una idea de como se verá la aplicación he creado una carpeta en el proyecto llamada recaps donde he insertado cada una de las páginas que he creado en el proyecto.

## Tecnologías utilizadas
- Creación de la base de datos, diseño App: MySQL WorkBench, Figma...
- Aplicación móvil: Android Studio, Kotlin, Material Design...
- Aplicación híbrida: Visual Studio Code, Angular, Ionic, Bootstrap...
- Tecnologías conjuntas: Firebase (Firestore & Authentication).
- Exportación de datos: Python (Pandas), PowerBI...

## Vista de la App (Manual de Usuario)
- [Link Screenshots](https://github.com/AlbertoParraToval/Host_Hotel/tree/master/screenshots)

## Manual y dependencias para usar el proyecto
Dando por hecho que tenemos ya instalado nuestro IDE (visual Studio Code), el framework de ionic y node.js para empezar a utilizar este proyecto debemos:
1. Usar el comando "npm i" que nos instalará todas las dependencias que tiene el proyecto.
2. Una vez que hemos realizado esto debemos usar el comando que iniciará nuestro proyecto de ionic, para ello tenemos dos posibilidades:
- ionic serve --> Inicializa el proyecto en modo browser.
- ionic serve -lab --> Inicializa el proyecto en modo móvil.

Para Generar la Apk de la aplicación debemos realizar los siguientes comandos
1.  npx cap add android 
2.  ionic build
3.  npx cap copy
Luego abrimos nuestro proyecto con el Android Studio y nos vamos a build y luego a Build/Apk

## Aplicación subida a la Web y la APK
- [HostHotel_Web](https://hosthotel-3c0d2.web.app/login)
- [HostHotel Movil](https://github.com/AlbertoParraToval/Host_Hotel/releases/tag/v7.0)
## Link a la Presentación del Proyecto 
[Link](https://docs.google.com/presentation/d/1nTuE8U5YL1PO4eP63vgPDw0BTjZxpIUd7Xw0JWczvUA/edit#slide=id.g252ae9db524_0_28)
- Además he añadido el pdf de la presentación en una carpeta del repositorio.
## Prototipo Figma
- [Link a Figma](https://www.figma.com/file/iqHdZ8hMSmV776VCocHdak/Figma-Ex?node-id=0%3A1&t=96XJG13YhSgDAEdr-1)

## Modelo de la base de datos
![image](https://github.com/AlbertoParraToval/Host_Hotel/assets/91873665/994becf6-3ec3-4f24-b58c-5f3aab9fb9da)

## Desarrollo por Semanas
### Semana 1 (27 Marzo - 2 Abril)
Creación del proyecto en Ionic con la conexión a Firebase y creado la funcionalidad de Login. Además realización del readme de github así como comenzar la base de datos de la App (En proceso), realización de la primera versión de Figma (adaptada a cambios futuros).

### Semana 2 (3 Abril - 9 Abril)
Modificaciones de la base de datos, asi como del figma debido a unas correcciones por parte de ambos integrantes. A su vez finalización del login, y reformulación del proyecto.

### Semana 3 (10 Abril - 16 Abril)
Realización de las siguientes páginas (home, configuración), además de la conexión con las demás páginas que más adelante será utilizadas e implementadas con los modelos también creados ya. Añadidos las features de traducción con posibilidad de ampliarlo a otro tipo de idioma como por ejemplo el Francés más maquetación del botón de cambiar idioma en modo footer. Añadido también estilos de fuente para toda la aplicación.

### Semana 4 (17 Abril - 23 Abril)
Adaptación de la app a móvil mediante las queries en el SCSS, donde a su vez se ha maquetado el core de la aplicación tanto en web como en móvil. Servicio de traducción actualizado y con nuevo diseño de elección de idioma. Actualización del Figma con una nueva versión de como es la maquetación de la App.

### Semana 5 (24 Abril - 30 Abril)
Terminar la interfaz base de la aplicación y dejar todo seteado para el comienzo de los CRUDS.

### Break debido a la cantidad de trabajo en el Erasmus (Mayo)

### Semana 6 (29 Mayo - 4 Junio)
Realización de la funcionalidad de eliminar la cuenta ya registrada previamente en la base de datos, ya que era uno de los puntos a realizar en el proyecto. Añadido la traducción correspondiente a cada nueva implementación. Nuevos componentes y actualizaciones en los servicios de user y hotels para donde he corregido diversos errores. Identificación de ciertos bugs o fallos por así decirlo a corregir a futuro.

Filtrado de hoteles donde se podrá elegir entre las 8 provincias andaluzas, para ver los distintos hoteles que dispone la aplicación hasta la fecha, y actualización de la el servicio de traducción para las nuevas features.
Listado de Clientes en una pági ()na que estará solo disponible en el modo admin donde se recogeran todos los usuarios registrados en la app (de momento solo esta la funcionalidad de leer).

### Semana 7 (5 Junio - 11 Junio)
Implementacion de una pipe que diferencia a los usuarios por el atributo admin, donde se ha diferenciado que puede hacer el usuario normal y que puede hacer el usuario que es ADMIN. Actualización de el servicio de traducción, y documentación de todo el código hasta la fecha. 
Actualizaciones de la interfaz donde se ha modificado bastante para hacerla mucho más userFriendly a la vez que se han corregido pequeños errores en los forms donde se iniciaba uno nuevo en vez de editar en si el hotel y la review seleccionada.

### Semana 8 (12 Junio - 15 Junio)
Realización de la parte de python y powerBi que son esenciales a la hora de documentar y finalizar el proyecto de final de grado, además se ha estado realizando una serie de modificaciones tanto en el FIGMA, como en la base de datos para que esté actualizada. Cambios en la interfaz para hacerla más facil y detallata.

Finalización de la parte de python donde en las páginas de clientes, hoteles y reviews hay un boton que exportara los datos de la página a un archivo .json y en el mismo proyecto se hará la manipulación de datos con python.

## Implementaciones siguientes
- Edición solo de las reviews de ese mismo usuario. (Implementado)
- Estrellas a modo de Rating. (Implementado)
- Filtrado de Reviews a través de Estrellas. (Implementado)
- Arreglar el bug de añadir hotel con imagen (Actualmente solo se puede añadir sin imagen y luego editarla y añadirla)

## Historial de Commits
[Ver historial de commits](https://github.com/AlbertoParraToval/Host_Hotel/commits)

## Videos Youtube
- [Video de Checkpoint](https://youtu.be/Vv869Pm4sgc)
- [Video Final](https://www.youtube.com/watch?v=tJAUSiJE9TQ)

## Repositorio DAM 2023 y Páginas Web Visitadas
- [Presentacion 2023 DAM](https://github.com/IESCampanillas/proyectos-dam-2023)
- [Firebase/doc](https://firebase.google.com/docs?hl=es-419)
- [Pandas](https://pandas.pydata.org/docs/)
- [Ionic Doc](https://ionicframework.com/docs)
- [Tutoriales PowerBi](https://www.youtube.com/@Officefacil)
