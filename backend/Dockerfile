# Etapa 1: Construcción (Maven + OpenJDK 17)
FROM maven:3.8.4-openjdk-17-slim AS build
WORKDIR /app

# Copiamos el pom y descargamos dependencias (optimiza el cache de Docker)
COPY pom.xml .
RUN mvn dependency:go-offline

# Copiamos el código y generamos el JAR
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Imagen de ejecución (JRE ligera)
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# El nombre del JAR se basa en tu <artifactId> y <version> del pom.xml
COPY --from=build /app/target/subsonic-usuarios-0.0.1-SNAPSHOT.jar app.jar

# Exponemos el puerto estándar
EXPOSE 8080

# Ejecución
ENTRYPOINT ["java", "-jar", "app.jar"]
