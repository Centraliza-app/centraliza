# Estágio de build
FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# Estágio de produção
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Copia a configuração do Nginx para lidar com o roteamento do React
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]