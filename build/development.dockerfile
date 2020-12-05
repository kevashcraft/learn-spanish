FROM node:14.15.1-buster-slim

RUN npm i -g @vue/cli

RUN mkdir /app
RUN chown 1000:1000 /app

RUN mkdir /secrets
RUN chown 1000:1000 /secrets

USER 1000
WORKDIR /app

COPY app/package*.json ./
RUN npm ci

COPY app/babel.config.js ./
COPY app/vue.config.js ./

CMD ["npm", "run", "serve"]
