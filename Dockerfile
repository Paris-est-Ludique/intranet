# App build
FROM node:20-alpine as build-stage

ARG PORT=3000
ARG API_URL="http://localhost:3000"

ENV NODE_OPTIONS="--max_old_space_size=4096"
ENV PORT=$PORT
ENV API_URL=$API_URL

## Enable corepack for proper version of YARN
RUN corepack enable

WORKDIR /app

## Copy file for YARN then install all deps
COPY .yarnrc.yml yarn.lock package.json ./
RUN yarn install --frozen-lockfile

## Build the app
COPY . ./
RUN yarn run build

## Run stage
FROM node:20-alpine

COPY --from=build-stage /app/public ./public
COPY --from=build-stage /app/node_modules ./node_modules
COPY --from=build-stage /app/access ./access

EXPOSE $PORT

CMD ["node", "./public/server"]
