# Agent guide

## Structure

- This is a dependency-free static GitHub Pages site; the repository root is the deployable web root.
- `index.html` and the local-only `cv.html` are thin CV shells. `scripts/cv.js` assembles both from `templates/header.html` and `templates/cv-content.html`; edit those fragments for shared CV changes rather than putting CV markup in either shell.
- `index.html` is the public CV page. `cv.html` is ignored by Git and loads `.cv-secrets.json` locally to add the email and phone number. Never put those private values in tracked files; `.cv-secrets.example.json` documents the expected fields.
- `about.html` is the About page and still has its own profile header, contact links, and navigation. Keep its `aria-current="page"` link correct. The AboutMe sections source of truth is `README.md`.
- `styles.css` is shared by both pages and contains the responsive breakpoints plus the A4 print stylesheet. `assets/favicon.svg` and `assets/icons.svg` are the only local image assets; the SVG sprite is referenced with fragment URLs such as `assets/icons.svg#category-ai`.
- Most organization and technology logos are deliberately loaded from external URLs in the HTML. Do not assume those images are available offline or replace them with generated local assets without checking the intended result.

## Verification

- There is no build, package manager, automated test, lint, or CI setup in this repository; do not invent an install/build workflow.
- `scripts/cv.js` uses browser `fetch()`, so preview from the repository root with `python3 -m http.server 8000`; do not open the pages directly with `file://`.
- Check `/` and `/about.html` in a browser at desktop and narrow widths. When CV markup or styling changes, also check local `/cv.html` with `.cv-secrets.json` present and inspect print preview for both CV pages because `styles.css` has dedicated print rules.
- For public-page changes, verify that `/` contains no email or phone links and does not request `.cv-secrets.json`. Keep `cv.html` and `.cv-secrets.json` ignored and run `git diff --check` before finishing.
