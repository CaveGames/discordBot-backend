FROM node:16

WORKDIR /usr/app

RUN npm install -g slappey


EXPOSE 3000
CMD npm run dev