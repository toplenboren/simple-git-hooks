---
"simple-git-hooks": patch
---

fix: resolve the project root from `INIT_CWD` during postinstall so hooks install correctly on isolated `node_modules` layouts (pnpm, yarn, bun, and other package managers) regardless of the store directory name
