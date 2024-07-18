FROM node:20.15.0-alpine
LABEL authors="devisitem"

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)

# install project dependencies
RUN apk add python3

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . ./
RUN ls -al

# build app for production with minification
RUN yarn install
RUN yarn build-only

EXPOSE 5173
CMD [ "http-server", "dist" ]
