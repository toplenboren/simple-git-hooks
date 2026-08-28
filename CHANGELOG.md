# Changelog

## 2.14.0

### Minor Changes

- [#138](https://github.com/toplenboren/simple-git-hooks/pull/138) [`2f3ec3f`](https://github.com/toplenboren/simple-git-hooks/commit/2f3ec3f95d895c46f0b9c7229504967a21f2a6cf) Thanks [@younggglcy](https://github.com/younggglcy)! - feat: silent success if nothing has changed

### Patch Changes

- [#146](https://github.com/toplenboren/simple-git-hooks/pull/146) [`e9e9367`](https://github.com/toplenboren/simple-git-hooks/commit/e9e93677304956a2c1991c62c3a4aff4b9917a59) Thanks [@colinhacks](https://github.com/colinhacks)! - fix: resolve the project root from `INIT_CWD` during postinstall so hooks install correctly on isolated `node_modules` layouts (pnpm, yarn, bun, and other package managers) regardless of the store directory name

- [#149](https://github.com/toplenboren/simple-git-hooks/pull/149) [`f071064`](https://github.com/toplenboren/simple-git-hooks/commit/f07106496af997a17d5b315d1795f23036845be5) Thanks [@wmaurer](https://github.com/wmaurer)! - fix: install and remove hooks correctly inside a git worktree, including worktrees created with `git worktree add --relative-paths`

- [#151](https://github.com/toplenboren/simple-git-hooks/pull/151) [`eb795de`](https://github.com/toplenboren/simple-git-hooks/commit/eb795deb076cd85b994da1c2b00e3ca748129d07) Thanks [@DanMat](https://github.com/DanMat)! - fix: don't crash `postinstall` when the resolved project directory has no package.json — skip instead of throwing an uncaught ENOENT

## 2.13.1

### Patch Changes

- [#128](https://github.com/toplenboren/simple-git-hooks/pull/128) [`2ad5514`](https://github.com/toplenboren/simple-git-hooks/commit/2ad5514dbbfbf11ffef9414c64d15a2dbe8ea756) Thanks [@OlofFredriksson](https://github.com/OlofFredriksson)! - fix: postinstall should ignore adding hooks if SKIP_INSTALL_SIMPLE_GIT_HOOKS is defined

- [#130](https://github.com/toplenboren/simple-git-hooks/pull/130) [`1abdcd7`](https://github.com/toplenboren/simple-git-hooks/commit/1abdcd7fd486058db76fe930542fd75e335ee462) Thanks [@cexoso](https://github.com/cexoso)! - fix: only get local `coore.hooksPath` config

## 2.13.0

### Minor Changes

- [#121](https://github.com/toplenboren/simple-git-hooks/pull/121) [`d9d7823`](https://github.com/toplenboren/simple-git-hooks/commit/d9d7823b8cef0a91a5aef37c2d5a9b913b61c1a0) Thanks [@chouchouji](https://github.com/chouchouji)! - feat: only remove some hooks that are not in `preserveUnused` option

- [#125](https://github.com/toplenboren/simple-git-hooks/pull/125) [`8486a22`](https://github.com/toplenboren/simple-git-hooks/commit/8486a2211340fcf14f6b534c862fb000961be115) Thanks [@nathanwhit](https://github.com/nathanwhit)! - feat: support `deno`'s `node_modules` structure

- [#127](https://github.com/toplenboren/simple-git-hooks/pull/127) [`8bb9818`](https://github.com/toplenboren/simple-git-hooks/commit/8bb9818876f11a2295ea8f80f666a5ee8e8ae13a) Thanks [@yyz945947732](https://github.com/yyz945947732)! - feat: optimize the migration experience from `husky`

## 2.12.1

### Minor Changes

- [#120](https://github.com/toplenboren/simple-git-hooks/pull/120) [`fc2acfc`](https://github.com/toplenboren/simple-git-hooks/commit/fc2acfc92830b0195e17a3fbcca4db90e3fa275b) Thanks [@JounQin](https://github.com/JounQin)! - feat: support esm format configs

## Previous Releases

See [**GitHub Releases**](https://github.com/toplenboren/simple-git-hooks/releases) for the changelog.
