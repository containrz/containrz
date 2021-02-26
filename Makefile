YARN := yarn
NPM := npm
NPX := npx

.PHONY: deps
deps:
	${YARN} lerna bootstrap

.PHONY: bump/patch
bump/patch:
	${YARN} lerna version patch

.PHONY: bump/minor
bump/minor:
	${YARN} lerna version minor

.PHONY: bump/major
bump/major:
	${YARN} lerna version major

.PHONY: test
test:
	${YARN} jest

.PHONY: test/watch
test/watch:
	${YARN} jest --watch

.PHONY: build
build:
	cd packages/containrz-core && $(YARN) build
	cd packages/containrz-container-local-storage && $(YARN) build
	cd packages/containrz-container-indexeddb && $(YARN) build
	cd packages/containrz-react-hook && $(YARN) build
	cd packages/containrz-stencil-decorator && $(YARN) build

.PHONY: publish
publish:
	${MAKE} version/bump
	${MAKE} build
	cd packages/containrz-core && $(NPM) publish
	cd packages/containrz-container-local-storage && $(NPM) publish
	cd packages/containrz-container-indexeddb && $(NPM) publish
	cd packages/containrz-react-hook && $(NPM) publish
	cd packages/containrz-stencil-decorator && $(NPM) publish
