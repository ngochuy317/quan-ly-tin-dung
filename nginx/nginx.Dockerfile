# FROM nginx:1.15.8-alpine
FROM nginx:1.25.1-alpine-slim

COPY nginx.conf /etc/nginx/conf.d/default.conf
