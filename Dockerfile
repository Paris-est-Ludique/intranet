# App build
FROM node:20-alpine as build-stage

## Enable corepack for proper version of YARN
RUN corepack enable

WORKDIR /app

RUN apk add --no-cache \
    libstdc++ \
    build-base \
    libtool \
    autoconf \
    automake \
    elfutils-dev \
    make \
    cmake \
    libcurl \
    python3 \
    nasm \
    libjpeg-turbo-dev

ENV NODE_OPTIONS="--max_old_space_size=4096"

## Copy file for YARN then install all deps
COPY .yarnrc.yml yarn.lock* package.json ./
RUN yarn install --frozen-lockfile

COPY . .

## Build the app
RUN yarn run build

EXPOSE 8080

CMD ["yarn", "start"]