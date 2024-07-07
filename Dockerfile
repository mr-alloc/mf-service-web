FROM node:20.15.0-alpine
LABEL authors="devisitem"

RUN ls -al
RUN pwd
WORKDIR /app
COPY . /app
RUN ls -al

RUN apk add --no-cache bash
RUN npm version
RUN npm install

ENTRYPOINT ["/usr/local/bin/npm", "run", "dev"]
