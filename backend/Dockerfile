# 1. Usamos una imagen oficial que incluye Java 23 (coincidiendo con tu entorno local)
FROM eclipse-temurin:23-jdk

# 2. Creamos una carpeta de trabajo dentro del contenedor llamada /app
WORKDIR /app

# 3. Copiamos el archivo .jar que compilaste con Maven hacia el contenedor
# (El asterisco coge cualquier archivo .jar de la carpeta target y lo renombra a app.jar)
COPY target/*.jar app.jar

# 4. Exponemos el puerto 8080 (el que usa Spring Boot por defecto)
EXPOSE 8080

# 5. El comando exacto que ejecutará Docker al encender el contenedor
ENTRYPOINT ["java", "-jar", "app.jar"]