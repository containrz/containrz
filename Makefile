YARN := yarn
NPM := npm
NPX := npx

.PHONY: deps
deps:
	$(NPX) lerna bootstrap

.PHONY: bump/patch
bump/patch:
	$(NPX) lerna version patch

.PHONY: bump/minor
bump/minor:
	$(NPX) lerna version minor

.PHONY: bump/major
bump/major:
	$(NPX) lerna version major

.PHONY: test
test:
	${YARN} jest

.PHONY: test/watch
test/watch:
	${YARN} jest --watch

.PHONY: build
build:
	cd packages/containrz-types && $(YARN) build
	cd packages/containrz-core && $(YARN) build
	cd packages/containrz-container-local-storage && $(YARN) build
	cd packages/containrz-container-indexeddb && $(YARN) build
	cd packages/containrz-react-hook && $(YARN) build

.PHONY: publish
publish:
	${MAKE} version/bump
	${MAKE} build
	cd packages/containrz-types && $(NPM) publish
	cd packages/containrz-core && $(NPM) publish
	cd packages/containrz-container-local-storage && $(NPM) publish
	cd packages/containrz-container-indexeddb && $(NPM) publish
	cd packages/containrz-react-hook && $(NPM) publish
