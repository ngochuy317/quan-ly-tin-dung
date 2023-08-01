FROM node:14.21.1 AS builder

# set working directory
WORKDIR /app

COPY . ./
COPY ./fe_app/package*.json ./
RUN npm install

ARG REACT_APP_API_URL

ENV REACT_APP_API_URL $REACT_APP_API_URL
ENV GENERATE_SOURCEMAP=false

COPY ./fe_app/public/index.html /app/public/index.html
COPY ./fe_app/src/ /app/src/
RUN npm run build

# expose port
EXPOSE 3000

FROM nginx:1.25.1-alpine-slim
COPY --from=builder /app/build /usr/share/nginx/html
# to make react-router work with nginx
COPY ./fe_app/nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
