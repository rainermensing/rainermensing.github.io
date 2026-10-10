CHROME ?= /Applications/Google Chrome.app/Contents/MacOS/Google Chrome
PDF ?= Rainer-Mensing-CV.pdf
PORT ?= 8765

.PHONY: pdf sync-about
sync-about:
	@python3 scripts/sync-about.py

pdf:
	@set -eu; \
	if [ ! -f .cv-secrets.json ]; then \
		printf 'Missing .cv-secrets.json; copy .cv-secrets.example.json and add your private contact details.\n' >&2; \
		exit 1; \
	fi; \
	if [ ! -x "$(CHROME)" ]; then \
		printf 'Chrome not found at %s; set CHROME to its executable path.\n' "$(CHROME)" >&2; \
		exit 1; \
	fi; \
	python3 -m http.server "$(PORT)" --bind 127.0.0.1 >/dev/null & \
	server_pid=$$!; \
	trap 'kill "$$server_pid" 2>/dev/null || true; wait "$$server_pid" 2>/dev/null || true' EXIT; \
	attempt=0; \
	until curl -fsS --connect-timeout 1 "http://127.0.0.1:$(PORT)/cv.html" >/dev/null 2>&1; do \
		if ! kill -0 "$$server_pid" 2>/dev/null; then \
			wait "$$server_pid" || true; \
			printf 'Could not start the local server on port %s.\n' "$(PORT)" >&2; \
			exit 1; \
		fi; \
		attempt=$$((attempt + 1)); \
		if [ "$$attempt" -ge 10 ]; then \
			printf 'Timed out waiting for the local server on port %s.\n' "$(PORT)" >&2; \
			exit 1; \
		fi; \
		sleep 1; \
	done; \
	"$(CHROME)" --headless --no-pdf-header-footer --virtual-time-budget=10000 \
		--print-to-pdf="$(PDF)" "http://127.0.0.1:$(PORT)/cv.html"; \
	test -s "$(PDF)"; \
	printf 'Created %s\n' "$(PDF)"
