# Handoff: context for a new Claude chat

Read this first. It summarises a previous chat that built and deployed this site.

## The project
- Website for **Arte Colore**, a paint and decorating shop: Via Roma 175, 30038 Spinea (VE), tel +39 041 990950, Arte Colore S.r.l., P. IVA 04463040271.
- Stack: React + TypeScript + Vite + Three.js, prerendered, 3 pages (`/`, `/prodotti/`, `/negozio/`). Design concept "Cartella colori" (sections are colour cards). The 3D models and renders were made with Blender (`blender/`). See `README.md`, `ASSETS.md`, `CONTENT-CHECKLIST.md`.
- Content rules: only verified business facts. Hours, email, socials, extra categories and services are unconfirmed; they're listed in `CONTENT-CHECKLIST.md`, not on the site.

## GitHub / deployment
- Repo: `NeoVolleyball/arte-colore` (public). Branches `main` and `claude/nifty-mendel-0o6v07` hold the same code. `magic-ui-phase1` (a Magic UI rework) was merged and then reverted by `restore-old-site`.
- Live site (GitHub Pages): https://neovolleyball.github.io/arte-colore/
- Deployed by `.github/workflows/deploy-pages.yml` (lint, tests, build with base path `/arte-colore/`, deploy).
- **Gotcha:** the repo's default branch is still `claude/nifty-mendel-0o6v07`, and GitHub Pages only deploys from the default branch. Either change the default to `main` (Settings → General), or run the workflow on the default branch.

## Open issue (why this note exists)
The owner has a **different version of the site on their own computer** that was never pushed to GitHub. The live site shows the GitHub version, not theirs.

**Next step in the new chat (on the owner's computer, in their arte-colore folder):**
1. Look at the local changes (`git status`, `git diff`, `git log`). Don't discard anything.
2. Commit them to a new branch, e.g. `my-local-version`, and push it.
3. Check it builds (`npm install && npm run build`).
4. Once the owner confirms that's the version they want live, make it `main`, merge into the default branch (or set the default branch to `main`), and run the "Deploy to GitHub Pages" workflow.
