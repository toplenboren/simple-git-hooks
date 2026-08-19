---
"simple-git-hooks": patch
---

fix: don't crash `postinstall` when the resolved project directory has no package.json — skip instead of throwing an uncaught ENOENT
