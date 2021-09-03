FROM node:16

WORKDIR /usr/app

RUN npm install -g slappey

CMD npm run dev