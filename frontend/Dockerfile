FROM node:alpine as build

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

#---

FROM nginx:alpine

COPY --from=build /app/build/ /var/www
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80