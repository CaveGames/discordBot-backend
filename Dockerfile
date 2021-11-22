FROM node:16

WORKDIR /usr/app

COPY --chmod=744 wait-for /wait-for
RUN apt-get update && apt-get install -y netcat

EXPOSE 3000
CMD /wait-for sql:3306 -- npm run dev