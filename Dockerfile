# App build
FROM node:20-alpine as build-stage

ARG user=node
ARG project_dir=/opt/node_app
ARG NODE_ENV=production
ARG PORT=3000

ENV NODE_ENV $NODE_ENV
ENV PORT $PORT
ENV NODE_OPTIONS="--max_old_space_size=4096"

EXPOSE $PORT

## Enable corepack for proper version of YARN
RUN corepack enable

RUN mkdir $project_dir && chown $user:$user $project_dir
USER $user
WORKDIR $project_dir

## Copy file for YARN then install all deps
COPY --chown=$user .yarnrc.yml yarn.lock package.json ./
RUN yarn install --frozen-lockfile

COPY --chown=$user . .

## Build the app
RUN yarn run build

CMD ["yarn", "start"]