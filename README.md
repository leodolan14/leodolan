# Leo Dolan — Personal Site

A static, dependency-light personal/academic site for Leo Dolan (economic
historian, University of Groningen). No UI framework — just vanilla ES
modules, Sass, and a hand-rolled hash router, structured as a component
library so each page section owns its own markup, styles and behavior. Vite
is used only as a dev server and build tool, not as an application framework.

## Stack

- **HTML** — one fragment per component, fetched at runtime and mounted by JS.
- **Vanilla JavaScript (ES modules)** — no framework, no jQuery. A small hash
  router swaps route content; each page is a small component module.
- **Sass (SCSS)** — BEM class names, a shared design-token layer
  (`styles/_variables.scss`, `_typography.scss`, `_breakpoints.scss`,
  `_mixins.scss`, `_utilities.scss`), compiled by Vite — there's no
  hand-maintained CSS file to keep in sync.
- **Zero runtime dependencies.**

## Project structure

```
index.html                 shell: nav mount point, #app router outlet, footer mount point
vite.config.js             dev server + build config (see "Running locally" / "Building for production")
js/
  main.js                   bootstraps nav + footer + router
  router/router.js          hash router (#/, #/research, #/publications, #/teaching, #/contact)
  utils/                    dom helpers, template loader, scroll-reveal, parallax
components/
  nav/, footer/, cursor/    persistent chrome (nav bar, footer, custom cursor)
  home/                     composes the home route
  hero/, profile/, home-intro/, stats/, fieldwork-gallery/
                             home's constituent sections, each self-contained
                             (fieldwork-gallery is also reused on the Research page)
  research/, publications/, teaching/, contact/
                             one route each: <name>.html + <name>.js + <name>.scss
styles/
  _variables.scss           colors, radius, shadows, z-index, timing
  _typography.scss          font stacks + heading/body mixins
  _breakpoints.scss         from()/until() media query mixins
  _mixins.scss              reveal-on-scroll, figure captions, focus rings, etc.
  _utilities.scss           .container, .u-eyebrow, .u-page-title, .page-section, ...
  main.scss                 entry point — imports tokens, then every component partial
assets/
  images/                   photography (see "Editing page content" below)
  icons/favicon.svg
```

Each component's `.js` file fetches its own `.html` fragment
(`js/utils/loadTemplate.js`), appends it to a mount point, and wires up any
behavior (scroll reveals, parallax, data-driven `<template>` lists). Nothing
touches global state; the router is the only thing that knows about routes.

## Editing page content

Most of the site's text lives directly in each component's `.html` file and
can be edited like any plain text file. A few sections are built from small
lists in a `.js` file instead, because the same layout repeats for a varying
number of items. Those spots each carry an `INSTRUCTIONS:` comment
explaining exactly how to add, remove or edit an entry, written for someone
who isn't a programmer:

- **Research photography gallery** — `components/fieldwork-gallery/fieldwork-gallery.html`
  (instructions at the top of the file)
- **Publications and working papers** — `components/publications/publications.js`
  (two `INSTRUCTIONS:` blocks, one per list)
- **Teaching timeline** — `components/teaching/teaching.js`
- **CV PDF** — the "Download CV" links on the home page
  (`components/hero/hero.html`) and the Contact page
  (`components/contact/contact.html`)

To find every one of these spots at once, search the project for the word
`INSTRUCTIONS`.

## Running locally

Requires Node 18+.

```bash
npm install
npm run dev     # Vite dev server with live reload, at http://localhost:4173
```

Vite compiles `styles/main.scss` on the fly (via the `sass` package) and
hot-reloads on every save — there's no separate watcher to run and no
compiled CSS file sitting in the repo to fall out of sync.

## Building for production

```bash
npm run build      # outputs a deployable site to dist/
npm run preview    # serve dist/ locally to sanity-check it, at http://localhost:4173
```

`vite build` bundles and hashes `js/main.js`'s whole import graph (the
router and every route component) and compiles `styles/main.scss`. Two
things fall outside that graph on purpose — components `fetch()` their own
`.html` fragments by plain string path, and images are referenced the same
way from those fragments — so a small plugin in `vite.config.js`
(`copyRuntimeFetchedAssets`) copies `components/**/*.html` and
`assets/images/` into `dist/` unbundled, at the same relative paths the
runtime code already expects. `dist/` itself is gitignored — regenerate it
with `npm run build` whenever you need it.

## Photography

`assets/images/` holds the site's photos at full resolution. To replace any
of them, keep the same filename and roughly the same aspect ratio — each
`<img>` carries explicit `width`/`height` attributes so the layout doesn't
shift when the image loads. See "Editing page content" above for how to add
or remove a photo from the research gallery specifically.

## Deploying to GitHub Pages

`.github/workflows/deploy.yml` builds and deploys automatically on every
push to `main` (and can be re-run manually from the Actions tab). It runs
`npm ci` + `npm run build`, then publishes `dist/` via
`actions/upload-pages-artifact` + `actions/deploy-pages` — no `gh-pages`
branch, no manual `dist/` pushing.

One-time setup: in the repo's **Settings → Pages**, set **Source** to
**GitHub Actions**. The next push to `main` will deploy.

`base: "./"` in `vite.config.js` keeps every built asset reference relative,
so this works whether Pages serves it from a domain root or a project
subpath (`username.github.io/repo-name/`) without any extra configuration.

## Accessibility notes

- Semantic landmarks (`nav`, `main`, `footer`), one `<h1>` per route.
- Skip-to-content link, visible focus rings on every interactive element.
- `prefers-reduced-motion` disables the fade-up transition, scroll reveals
  (content shows immediately instead of staying hidden), and the parallax gallery.
