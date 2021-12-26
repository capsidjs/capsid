.PHONY: test
test:
	deno test --config deno.json -A --unstable --no-check

.PHONY: cov
cov:
	deno test --coverage=cov --config deno.json -A --unstable --no-check

.PHONY: fmt
fmt:
	deno fmt

.PHONY: fmt-check
fmt-check:
	deno fmt --check

.PHONY: lint
fmt:
	deno lint
