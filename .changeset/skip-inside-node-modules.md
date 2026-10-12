---
"simple-git-hooks": patch
---

fix: skip installing hooks when the CLI runs inside `node_modules`, so a dependency that calls `simple-git-hooks` from its own install script no longer overwrites or removes the parent project's git hooks
