FROM node AS build

WORKDIR /app

COPY package.* /app

RUN yarn 

COPY . /app

RUN yarn run build

FROM nginx

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

