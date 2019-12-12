FROM node:8-alpine as dev
COPY ./ /app
WORKDIR /app
RUN npm install --unsafe-perm

FROM node:8-alpine as build
WORKDIR /app
COPY --from=dev /app /app
RUN npm run postinstall
RUN npm run build

FROM nginx:1.17.5-alpine as prod
COPY --from=build /app/dist /app
COPY nginx.conf /etc/nginx/nginx.conf