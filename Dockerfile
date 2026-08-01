FROM node:20-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM alpine:latest
RUN apk add --no-cache ca-certificates unzip wget bash curl

ENV PB_VERSION=0.22.21

WORKDIR /pb

RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip

COPY --from=frontend-builder /app/dist /pb/pb_public
COPY pocketbase_schema.json /pb/pocketbase_schema.json
COPY pb_migrations /pb/pb_migrations

EXPOSE 8080

CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080", "--dir=/pb/pb_data", "--publicDir=/pb/pb_public"]
