# Dockerfile
FROM node:latest
RUN npm install -g pnpm
WORKDIR /app
EXPOSE 5173