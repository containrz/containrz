YARN := yarn
NPM := npm

.PHONY: deps
deps:
	$(YARN) lerna bootstrap

.PHONY: bump/patch
bump/patch:
	$(YARN) lerna version patch

.PHONY: bump/minor
bump/minor:
	$(YARN) lerna version minor

.PHONY: bump/major
bump/major:
	$(YARN) lerna version major

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
	cd packages/containrz-container && $(YARN) build
	cd packages/containrz-container-local-storage && $(YARN) build
	cd packages/containrz-react-hook && $(YARN) build

.PHONY: publish
publish:
	${MAKE} build
	${MAKE} version/bump
	cd packages/containrz-types && $(NPM) publish
	cd packages/containrz-core && $(NPM) publish
	cd packages/containrz-container && $(NPM) publish
	cd packages/containrz-container-local-storage && $(NPM) publish
	cd packages/containrz-react-hook && $(NPM) publish

.PHONY: link
link:
	${MAKE} build
	(cd packages/containrz-types && $(NPM) link && $(YARN) link)
	(cd packages/containrz-core && $(NPM) link && $(YARN) link)
	(cd packages/containrz-container && $(NPM) link && $(YARN) link)
	(cd packages/containrz-container-local-storage && $(NPM) link && $(YARN) link)
	(cd packages/containrz-react-hook && $(NPM) link && $(YARN) link)

.PHONY: unlink
unlink:
	(cd packages/containrz-types && $(NPM) unlink && $(YARN) unlink)
	(cd packages/containrz-core && $(NPM) unlink && $(YARN) unlink)
	(cd packages/containrz-container && $(NPM) unlink && $(YARN) unlink)
	(cd packages/containrz-container-local-storage && $(NPM) unlink && $(YARN) unlink)
	(cd packages/containrz-react-hook && $(NPM) unlink && $(YARN) unlink)