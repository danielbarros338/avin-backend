FROM node:18.13.0-alpine

RUN mkdir -p /usr/src/backend/avin
WORKDIR /usr/src/backend/avin

RUN apk update && apk upgrade
RUN apk add git
RUN apk add yarn

COPY . /usr/src/backend/avin
RUN yarn install

EXPOSE 3345

CMD ["yarn", "start"]