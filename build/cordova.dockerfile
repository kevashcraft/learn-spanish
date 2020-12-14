FROM node:12.3.1-stretch as builder

RUN echo "hello"

RUN npm i -g @vue/cli cordova cordova-icon cordova-splash

RUN apt-get update
RUN apt-get install -y default-jdk-headless
RUN apt-get install -y android-sdk
RUN apt-get install -y imagemagick

RUN cd /tmp && \
  git clone https://github.com/Shadowstyler/android-sdk-licenses.git && \
  cp -a android-sdk-licenses/*-license /usr/lib/android-sdk/licenses && \
  rm -rf android-sdk-licenses

RUN mkdir -p /cordova
WORKDIR /cordova
RUN cordova create spanish com.kevapps.spanish_photo_flash spanish

WORKDIR /cordova/spanish
RUN cordova telemetry off
RUN cordova platform add android
RUN cordova plugin add cordova-plugin-file
RUN cordova plugin add cordova-plugin-device
RUN cordova build; exit 0

RUN mkdir -p /dist # mounted volume
RUN mkdir -p /secrets # mounted volume
RUN mkdir -p /app/src # mounted volume
RUN mkdir -p /app/public # mounted volume

WORKDIR /app
COPY ./app/package.json .
COPY ./app/package-lock.json .
RUN npm ci

# COPY ./app/.env .
COPY ./app/babel.config.js .
COPY ./app/vue.config.js .

WORKDIR /cordova/spanish
COPY ./res res

COPY ./build/build-app /bin/
COPY ./build/build-apk /bin/
COPY ./build/build-cordova-ios /bin/

# keytool -genkey -v -keystore learn-spanish.keystore -alias learn-spanish -keyalg RSA -keysize 2048 -validity 20000
