FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install

RUN mkdir -p /app/build

COPY build/ /app/build

EXPOSE 80

CMD [ "node", "./build/main.js" ]