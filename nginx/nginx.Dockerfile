FROM nginx:1.25.1-alpine-slim

COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
