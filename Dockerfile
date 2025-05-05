FROM node AS build

WORKDIR /app

COPY package.* /app

RUN yarn 

COPY . /app

RUN yarn run build

FROM node:alpine

WORKDIR /app

COPY --from=build /app/ /app/

ENTRYPOINT [ "yarn", "run", "start" ]

EXPOSE 3000