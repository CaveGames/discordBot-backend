FROM node:16

WORKDIR /usr/app

COPY wait-for /wait-for
RUN chmod 744 /wait-for && apt-get update && apt-get install -y netcat

EXPOSE 3000
CMD /wait-for sql:3306 -- npm run dev