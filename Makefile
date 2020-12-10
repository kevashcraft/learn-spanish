default: dev

.PHONY: build decks

bash: build_bash
	docker-compose -f build/docker-compose.yaml -p learn_spanish run bash bash

build_bash:
	docker-compose -f build/docker-compose.yaml -p learn_spanish build bash

build:
	docker-compose -f build/docker-compose.yaml -p learn_spanish build app

dev: down build
	docker-compose -f build/docker-compose.yaml -p learn_spanish up app

down:
	docker-compose -f build/docker-compose.yaml -p learn_spanish down -v

decks:
	docker run \
			-it \
			-v $(shell pwd)/decks:/decks \
			-v $(shell pwd)/secrets:/secrets \
									-p 48080:80 \
									node:13.2.0-buster-slim bash

cordova_build: build
	docker build -t spanish_cordova -f build/cordova.dockerfile .

cordova: cordova_build
	docker run \
			-it \
			-v $(shell pwd)/cordova-ios:/cordova-ios \
			-v $(shell pwd)/dist:/dist \
			-v $(shell pwd)/res:/res \
			-v $(shell pwd)/app/src:/app/src \
			-v $(shell pwd)/app/public:/app/public \
			-v $(shell pwd)/build/config-ios.xml:/cordova/spanish/config-ios.xml \
			-v $(shell pwd)/build/config.xml:/cordova/spanish/config.xml \
								spanish_cordova bash

cordova_prod: cordova_build
	docker run \
			-it \
			-v $(shell pwd)/dist:/dist \
			-v $(shell pwd)/secrets:/secrets \
			-v $(shell pwd)/app/src:/app/src \
			-v $(shell pwd)/app/public:/app/public \
			-v $(shell pwd)/build/config.xml:/cordova/spanish/config.xml \
								spanish_cordova bash -c "\
																		build-app; \
																		cd /cordova/spanish; \
																		rm -rf www; \
																		mv /app/dist www; \
																		cordova build android \
								--release \
								-- \
								--keystore /secrets/learn-spanish.keystore \
								--alias kevapps_one \
								--storePassword=$(keystore_pass) \
								--password=$(keystore_pass) && \
								cp /cordova/spanish/platforms/android/app/build/outputs/apk/release/app-release.apk /dist/app-release.apk"

prod_build:
	docker build -f build/production.dockerfile -t kevashcraft/learn-spanish:latest .

prod_push: prod_build
	docker push kevashcraft/learn-spanish:latest

upgrade: prod_build prod_push
	helm upgrade learn-spanish build/chart

install: prod_push
	helm install learn-spanish build/chart
