# Subsonic Festival L2-G3
Proyecto de la asignatura PI (Programación en Internet)
<p align="center">
<h2 align="center">Subsonic Festival</h2>
  <img src="https://newcastlelive.com.au/wp-content/uploads/2024/10/SUB24_Businessdimensions_003-1024x626.jpg">
    <p align="left">
    Plataforma Web para la promoción y gestión de eventos.
    Como servicios destacamos: la venta de entradas, la comercialización de merchandising, el alquiler de espacios para provedores o la difusión de los artistas y canciones que formarán parte del festival.
    <br />
   
  </p>
</p>


  <!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block"> 📋 Contenido</h2></summary>
  <ol>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#%EF%B8%8F-acerca-del-proyecto">Acerca del Proyecto</a></li>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#-estructura-del-proyecto">Estructura del Proyecto</a></li>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#%E2%80%8D%EF%B8%8F-prerequisitos">Prerequisitos</a></li>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#%EF%B8%8F-instalaci%C3%B3n">Instalación</a></li>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#%EF%B8%8F-ejecutar-el-proyecto-localmente">Ejecutar el proyecto localmente</a></li>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#-apartados-de-la-app">Apartados de la App</a></li>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#-c%C3%B3mo-se-usa-la-api">¿Cómo se usa la API?</a></li>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#%E2%80%8D%E2%80%8D%E2%80%8D-miembros-del-grupo-3-lab-2">Miembros</a></li>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#%EF%B8%8F-licencia">Licencia</a></li>
    <li><a href="https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3?tab=readme-ov-file#-contacto">Contacto</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## ✏️ Acerca del Proyecto

Creado por el Grupo 3 (Lab 2), Copyright © 2026 L2-G3 PI.

### Lenguajes de Programación

<!-- * ♨️ Java-->
* **Frontend:** 🟨 JavaScript (⚛️ React)
* **Backend:** ♨️ Java (🟦 Spring Boot)
* **Base de datos:** 🐘 PostgreSQL

### Bases de datos PostgreSQL

![Database Diagram](https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3/raw/main/Recursos/Esquema_BBDD.png)



* *Para más detalle ver en la carpeta de Recursos*

<!-- ABOUT THE PROJECT -->
## 🏯 Estructura del Proyecto

```bash
.
├── frontend/               # React frontend
│   ├── public/             # Media
│   ├── src/                # Componentes y páginas React
│   └── package.json        # Depndencias React
├── backend/                # Spring Boot backend
│   ├── src/                # Código Java para las APIs y servicios
│   └── pom.xml             # Dependencias Maven
└── README.md               # Documentación del Proyecto 
```

<!-- ABOUT THE PROJECT -->
## 👷‍♂️ Prerequisitos

Antes de empezar, asegurate de que tienes instalados las siguientes aplicaciones:

- **Node.js**, actualmente usando 
v24.14.1 (LTS)
https://nodejs.org/es/download

Comprueba instalación:

```bash
C:\Users\USUARIO>node -v
v24.14.1
C:\Users\USUARIO>npm -v
11.9.0
```
- **PostgreSQL** actualmente usando PostgreSQL 18.3.2
https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
- **Java**, actualmente usando v.17 (se descarga desde Intellij IDEA)

**Propio:** Java SE Development Kit 17.0.17 https://www.oracle.com/java/technologies/javase/jdk17-0-13-later-archive-downloads.html
Intellij IDEA: Con OpenJDK 23.0.2 tambio funciona, sino Microsoft JDK 17 inclido en el propio Intelij
- **Maven** actualmente usando Intellij IDEA 2026.1
https://www.jetbrains.com/idea/download/?section=windows
- **Git** actualmente usando Git 2.53.0
https://git-scm.com/

<!-- GETTING STARTED -->
## ⌨️ Instalación

Para descargar y ejecutar el proyecto en tu ordenador sigue estos sencillos pasos:

### 1. Clona el repositorio:

```bash
git clone https://github.com/antonioRodriguez7/Subsonic-Festival-L2G3.git
cd subsonicFestivalApp
```

### 2. Instala dependencias del frontend:

```bash
cd frontend
npm install
```


### 3. Crea el servidor y la base de datos:

Utilizamos pgAdmin 4 para esto.

**Servidor:** PBD
- **Nombre del Host:** localhost
- **Puerto**: 5432
- **Usuario**: postgres
- **Contraseña**: 12345
- **Guardar Contraseña**: Si


**BBDD:** subsonic_db


### 4. Instala las dependencias del backend:

- 1. Abre el proyecto, el pom.xml, y abrelo como proyecto con el Inteliji IDEA. (solo la parte de Backend)
- 2. Ejecuta SubsonicUsuariosApplication


```bash
cd ../backend
mvn clean install
```


## 🏗️ Ejecutar el proyecto localmente

### 1. Frontend:

```bash
cd frontend
npm run dev
```

El frontend es accesible en la dirección `http://localhost:5173`.

### 2. Backend:

```bash
cd backend
./mvnw spring-boot:run
```

El backend es accesible en la dirección `http://localhost:8080`.

### 3. Accede a la aplicación:

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:8080`
- **PostgreSQL:** `localhost:5432` (default username: `postgres`, password: `12345`)


<!-- USAGE EXAMPLES -->
## 💻 Apartados de la App

En la Subsonic Festival App tienes acceso a 4 apartados diferentes:

### 🌐 Apartado principal 
  - Búsqueda de eventos 
  - Compra de Entradas
  - Consulta de Artistas

### 🙋 Mi cuenta
Una vez registrado prodrás:
  - Adquirir entradas
  - Cancelar entradas
  - Modificar datos personales

### 🎧 Reproductor de Música
Desde esta misma app podrás reproducir canciones de artistas participantes.

### 👨‍🏭 Proveedores de Servicios
Se dará soporte a:
  - Alquiler de espacios
  <!-- - Publicidad -->


<!-- USAGE EXAMPLES -->
## 🔖 ¿Cómo se usa la API?
Usa postman para interactuar con la aplicación.

En el archivo que has importado previamente, tendrás 4 apartados con los que poder interactuar con la API.

- Artist
- Space
- Ticket
- User


## 👩‍👩‍👧‍👧 Miembros del Grupo 3 (Lab 2)

1. Miguel Castelló Sosa
2. Carlos García Sánchez
3. José María Gordillo Gragera
4. Iván López García
5. Antonio Rodríguez Iglesias

<!-- LICENSE -->
## ®️ Licencia

Copyright © 2026 L2-G3 PI.

<!-- CONTACT -->
## 📥 Contacto

Si tienes cualquier problema, contáctanos por correo a mcastelly@alumnos.unex.es