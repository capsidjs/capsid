.PHONY: test
test:
	deno test --config deno.json -A --unstable --no-check

.PHONY: cov
cov:
	deno test --coverage=cov --config deno.json -A --unstable --no-check

.PHONY: fmt
fmt:
	deno fmt --config deno.json

.PHONY: fmt-check
fmt-check:
	deno fmt --check --config deno.json

.PHONY: lint
lint:
	deno lint --config deno.json

.PHONY: dist
dist:
	deno bundle --config deno.json src/mod.ts > dist.js

.PHONY: min
min:
	$(MAKE) dist
	terser --compress --mangle -o dist.min.js -- dist.js

.PHONY: size
size:
	$(MAKE) min
	deno run --allow-read https://deno.land/x/gzip_size@v0.2.3/cli.ts --include-original dist.min.js

.PHONY: dnt
dnt:
	deno run -A dnt.ts

.PHONY: npm-publish
npm-publish:
	rm -rf node
	$(MAKE) dnt
	cd node && npm publish
