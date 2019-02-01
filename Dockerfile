FROM node:8

WORKDIR /app

COPY . .

RUN yarn

ENV NODE_ENV=production
EXPOSE 5000

CMD node src/app.js
