# Agent guide

## Structure

- This is a dependency-free static GitHub Pages site; the repository root is the deployable web root.
- `index.html` is the CV page and `about.html` is the About page. They duplicate the profile header, contact links, and navigation, so shared content changes usually need edits in both files; keep each page's `aria-current="page"` link correct. The AboutMe sections source of truth is the README.md
- `styles.css` is shared by both pages and contains the responsive breakpoints plus the A4 print stylesheet. `assets/favicon.svg` and `assets/icons.svg` are the only local image assets; the SVG sprite is referenced with fragment URLs such as `assets/icons.svg#category-ai`.
- Most organization and technology logos are deliberately loaded from external URLs in the HTML. Do not assume those images are available offline or replace them with generated local assets without checking the intended result.

## Verification

- There is no build, package manager, automated test, lint, or CI setup in this repository; do not invent an install/build workflow.
- Preview changes from the repository root with `python3 -m http.server 8000`, then check `/` and `/about.html` in a browser at desktop and narrow widths. Also check print preview when changing layout or content because `styles.css` has dedicated print rules.
