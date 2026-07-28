# ETAPA 1: Compilar el Frontend React
FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ETAPA 2: Servidor de PocketBase + Frontend Estático
FROM alpine:latest
RUN apk add --no-cache ca-certificates unzip wget bash curl

ENV PB_VERSION=0.22.21

WORKDIR /pb

# Descargar e instalar PocketBase
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip

# Copiar el Frontend compilado a la carpeta estática de PocketBase
COPY --from=frontend-builder /app/dist /pb/pb_public

# Copiar esquema de colecciones
COPY pocketbase_schema.json /pb/pocketbase_schema.json

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data", "--publicDir=/pb/pb_public"]
