DOCKER_USER=finboxio
DOCKER_IMAGE=prometheus-rancher-exporter

GIT_BRANCH := $(shell git rev-parse --abbrev-ref HEAD)
GIT_COMMIT := $(shell git rev-parse HEAD)
GIT_REPO := $(shell git remote -v | grep origin | grep "(fetch)" | awk '{ print $$2 }')
GIT_DIRTY := $(shell git status --porcelain | wc -l)
GIT_DIRTY := $(shell if [[ "$(GIT_DIRTY)" -gt "0" ]]; then echo "yes"; else echo "no"; fi)

VERSION := $(shell git describe --abbrev=0)
VERSION_DIRTY := $(shell git log --pretty=format:%h $(VERSION)..HEAD | wc -w | tr -d ' ')

BUILD_COMMIT := $(shell if [[ "$(GIT_DIRTY)" == "yes" ]]; then echo $(GIT_COMMIT)+dev; else echo $(GIT_COMMIT); fi)
BUILD_COMMIT := $(shell echo $(BUILD_COMMIT) | cut -c1-12)
BUILD_VERSION := $(shell if [[ "$(VERSION_DIRTY)" -gt "0" ]]; then echo "$(VERSION)-$(BUILD_COMMIT)"; else echo $(VERSION); fi)
BUILD_VERSION := $(shell if [[ "$(VERSION_DIRTY)" -gt "0" ]] || [[ "$(GIT_DIRTY)" == "yes" ]]; then echo "$(BUILD_VERSION)-dev"; else echo $(BUILD_VERSION); fi)
BUILD_VERSION := $(shell if [[ "$(GIT_BRANCH)" != "master" ]]; then echo $(GIT_BRANCH)-$(BUILD_VERSION); else echo $(BUILD_VERSION); fi)

DOCKER_IMAGE := $(shell if [[ "$(DOCKER_REGISTRY)" ]]; then echo $(DOCKER_REGISTRY)/$(DOCKER_USER)/$(DOCKER_IMAGE); else echo $(DOCKER_USER)/$(DOCKER_IMAGE); fi)
DOCKER_VERSION := $(shell echo "$(DOCKER_IMAGE):$(BUILD_VERSION)")
DOCKER_LATEST := $(shell if [[ "$(VERSION_DIRTY)" -gt "0" ]] || [[ "$(GIT_DIRTY)" == "yes" ]]; then echo "$(DOCKER_IMAGE):dev"; else echo $(DOCKER_IMAGE):latest; fi)

COMPOSE_FILES := $(shell ls docker-compose.* | xargs -n1 echo -f | xargs)

DOCKER_BUILD_ARGS := $(shell echo "--build-arg LR_NPM_TOKEN=${LR_NPM_TOKEN}")
DOCKER_BUILD_ARGS := $(shell if [[ "$(NPM_HTTP_PROXY)" ]]; then echo "$(DOCKER_BUILD_ARGS) --build-arg HTTP_PROXY=$(NPM_HTTP_PROXY) --build-arg HTTPS_PROXY=$(NPM_HTTP_PROXY)"; else echo "$(DOCKER_BUILD_ARGS)"; fi)
DOCKER_BUILD_ARGS := $(shell if [[ "$(NPM_STRICT_SSL)" == "false" ]]; then echo "$(DOCKER_BUILD_ARGS) --build-arg STRICT_SSL=false"; else echo "$(DOCKER_BUILD_ARGS)"; fi)

docker.dev:
	@docker-compose-watch -f docker-compose.yml exporter

docker.test:
	@docker-compose -f docker-compose.test.yml up --build -d exporter-test
	@docker-compose -f docker-compose.test.yml run --rm exporter-test npm test

docker.ava:
	@docker-compose -f docker-compose.test.yml up --build exporter-test

docker.stop:
	@docker-compose $(COMPOSE_FILES) stop

docker.down:
	@docker-compose $(COMPOSE_FILES) down

docker.cleanup:
	@docker-compose $(COMPOSE_FILES) down -v --remove-orphans

docker.build:
	@docker build $(DOCKER_BUILD_ARGS) -t $(DOCKER_VERSION) -t $(DOCKER_LATEST) .

docker.push: docker.build
	@docker push $(DOCKER_VERSION)
	@docker push $(DOCKER_LATEST)

dev:
	@NODE_PATH=app/lib ./node_modules/.bin/node-dev app/index.js

test:
	@CONFIG=test npm test

ava:
	@CONFIG=test npm run watch

info:
	@echo "git branch:      $(GIT_BRANCH)"
	@echo "git commit:      $(GIT_COMMIT)"
	@echo "git repo:        $(GIT_REPO)"
	@echo "git dirty:       $(GIT_DIRTY)"
	@echo "version:         $(VERSION)"
	@echo "commits since:   $(VERSION_DIRTY)"
	@echo "build commit:    $(BUILD_COMMIT)"
	@echo "build version:   $(BUILD_VERSION)"
	@echo "docker images:   $(DOCKER_VERSION)"
	@echo "                 $(DOCKER_LATEST)"

version:
	@echo $(BUILD_VERSION) | tr -d '\r' | tr -d '\n' | tr -d ' '

lint:
	@npm run lint
