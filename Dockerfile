FROM node:16-alpine

RUN mkdir -p /app
WORKDIR /app
COPY . .

RUN yarn install --frozen-file

CMD yarn run dev