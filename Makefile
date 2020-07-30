YARN := yarn
NPM := npm

.PHONY: deps
deps:
	$(YARN) lerna bootstrap

.PHONY: build
build:
	cd packages/containrz-types && $(YARN) build
	cd packages/containrz-core && $(YARN) build
	cd packages/containrz-container && $(YARN) build
	cd packages/containrz-container-local-storage && $(YARN) build
	cd packages/containrz-react-hook && $(YARN) build

.PHONY: version/bump
version/bump:
	$(YARN) lerna version patch

.PHONY: test
test:
	${YARN} jest

.PHONY: test/watch
test/watch:
	${YARN} jest --watch

.PHONY: publish
publish:
	${MAKE} build
	${MAKE} version/bump
	cd packages/containrz-types && $(NPM) publish
	cd packages/containrz-core && $(NPM) publish
	cd packages/containrz-container && $(NPM) publish
	cd packages/containrz-container-local-storage && $(NPM) publish
	cd packages/containrz-react-hook && $(NPM) publish