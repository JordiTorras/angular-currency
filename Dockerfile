# Stage 0, based on Node.js, to build and compile Angular
FROM node:latest as node
WORKDIR /app
COPY ./ /app/
RUN npm install
ARG configuration=production
RUN npm run build -- --prod --configuration=$configuration

# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx
COPY --from=node /app/dist/angular-currency /usr/share/nginx/html
COPY ./nginx-custom.conf /etc/nginx/conf.d/default.conf

# Construir la build
#   docker build -t docker-moneda:STA-0-1-1 --build-arg configuration="staging" .

# Ejecutar el contenedor
#   docker run -d -p 80:80 docker-moneda:STA-0-1-1