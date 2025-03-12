FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG RECOGNIZE_DOMAIN
ENV RECOGNIZE_DOMAIN=$RECOGNIZE_DOMAIN

CMD ["npm", "start"]