FROM node:20.15.0-alpine
LABEL authors="devisitem"

# install simple http server for serving static content
RUN npm i -g http-server vite

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)

# install project dependencies
RUN apk add make python3

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . ./

# build app for production with minification
RUN yarn build-only

EXPOSE 5173
CMD [ "http-server", "dist" ]
