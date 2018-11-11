FROM node:4-onbuild

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY package.json /app/package.json
RUN npm install --no-optional && npm cache clean --force

COPY bower.json /app/bower.json
RUN npm install -g bower@1.4.1
RUN bower install --allow-root

COPY . /app

FROM node:4-alpine

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

WORKDIR /app

COPY --from=0 /app /app

EXPOSE 3000

CMD node /app/bin/www
