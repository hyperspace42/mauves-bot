FROM node:16-alpine

RUN mkdir -p /app
WORKDIR /app
COPY . .

RUN yarn

CMD yarn run dev