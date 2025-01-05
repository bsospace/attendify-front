# base images
FROM node:lts-slim AS Buildder

# set working directory
WORKDIR /app

# copy dependencies
COPY package.json package-lock.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# build source code
RUN npm run build

# nginx image
FROM nginx:alpine AS production

# serve the app to using a lightweight web server
COPY --from=Buildder /app/dist /usr/share/nginx/html

#expose port
EXPOSE 80

# start the server
CMD ["nginx", "-g", "daemon off;"]