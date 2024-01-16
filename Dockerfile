FROM node:iron-slim

WORKDIR /home/node/app

COPY package*.json .
COPY tsconfig.*json .
COPY ./src ./src

RUN npm install && npm run build

CMD [ "node", "./dist/index.js" ]