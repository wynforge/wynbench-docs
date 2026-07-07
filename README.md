# Wynbench Docs

Documentation site for Wynbench's current three-repository setup (`wynbench-agent`, `wynbench-ui`, and `wynbench-docs`).

Built with [Docusaurus 3](https://docusaurus.io/).

---

## Local development

### Prerequisites

- [Node.js](https://nodejs.org/) 20 or later
- npm 10 or later (bundled with Node.js)

### Install dependencies

```bash
npm install
```

### Start the dev server

```bash
npm start
```

This starts the Docusaurus development server at `http://localhost:3000` with live reload.

---

## Build the site

```bash
npm run build
```

The static output is written to the `build/` directory. You can preview it locally:

```bash
npm run serve
```

---

## Project structure

```
wynbench-docs/
├── docs/
│   ├── overview.md
│   ├── connections.md
│   ├── actions-and-workflows.md
│   ├── plugin-development.md
│   ├── msmq-shim.md
│   ├── packaging-and-deployment.md
│   ├── architecture/
│   │   ├── agent.md
│   │   ├── ui.md
│   │   ├── plugins.md
│   │   └── packager.md
│   └── getting-started/
│       ├── install.md
│       ├── run-agent.md
│       └── run-ui.md
├── src/
│   ├── pages/
│   │   └── index.tsx       ← landing page
│   └── css/
│       └── custom.css      ← theme overrides
├── static/
│   └── img/                ← logos, favicons
├── docusaurus.config.ts    ← site config (title, navbar, theme)
├── sidebars.ts             ← sidebar navigation structure
└── package.json
```

---

## Adding a new page

1. Create a Markdown file in the appropriate `docs/` subdirectory.
2. Add a front-matter block at the top:

```markdown
---
id: my-new-page
title: My New Page
sidebar_position: 5
---
```

3. Add the page to `sidebars.ts` in the desired position.

---

## Dark / light mode

The site respects the user's OS colour-scheme preference by default. A toggle button in the navbar allows manual switching. Theme colours are defined in `src/css/custom.css`.

---

## Deployment

The site is configured for GitHub Pages deployment under `wynforge.github.io/wynbench-docs/`. To deploy:

```bash
GIT_USER=<your-github-username> npm run deploy
```

Or let the CI pipeline handle it on every push to `main`.

## Scope

This documentation intentionally tracks the current Go agent and React UI implementation and avoids assumptions about older runtime stacks.
