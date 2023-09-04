# simple-git-hooks

![](https://img.shields.io/badge/dependencies-zero-green) [![Tests](https://github.com/toplenboren/simple-git-hooks/actions/workflows/tests.yml/badge.svg?branch=master)](https://github.com/toplenboren/simple-git-hooks/actions/workflows/tests.yml)

A tool that lets you easily manage git hooks

> The package was recently renamed from `simple-pre-commit`.

> See **Releases** for the `simple-pre-commit` documentation and changelog

- Zero dependency
- Small configuration (1 object in package.json)
- Lightweight:

  | Package                      | Unpacked size | With deps |
  | ---------------------------- | ------------- | --------- |
  | husky v4 `4.3.8`             | `53.5 kB`     | `~1 mB`   |
  | husky v6 `6.0.0`             | `6.86 kB`     | `6.86 kB` |
  | pre-commit `1.2.2`           | `~80 kB`      | `~850 kB` |
  | **simple-git-hooks** `2.2.0` | `10.1 kB`     | `10.1 kB` |

### Who uses simple-git-hooks?

- [Autoprefixer](https://github.com/postcss/autoprefixer)
- [PostCSS](https://github.com/postcss/postcss.org)
- [Browserslist](https://github.com/browserslist/browserslist)
- [Nano ID](https://github.com/ai/nanoid)
- [Size Limit](https://github.com/ai/size-limit)
- [Storeon](https://github.com/storeon/storeon)
- [Directus](https://github.com/directus/directus)
- [Vercel/pkg](https://github.com/vercel/pkg)
- More, see [full list](https://github.com/toplenboren/simple-git-hooks/network/dependents?package_id=UGFja2FnZS0xOTk1ODMzMTA4)

### What is a git hook?

A git hook is a command or script that is going to be run every time you perform a git action, like `git commit` or `git push`.

If the execution of a git hook fails, then the git action aborts.

For example, if you want to run `linter` on every commit to ensure code quality in your project, then you can create a `pre-commit` hook that would call `npx lint-staged`.

Check out [lint-staged](https://github.com/okonet/lint-staged#readme). It works really well with `simple-git-hooks`.

You can look up about git hooks on the [Pro Git book](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks).

### When to use it

`simple-git-hooks` works well for small-sized projects when you need quickly set up hooks and forget about it.

However, this package requires you to manually apply the changes to git hooks. If you update them often, this is probably not the best choice.

Also, this package allows you to set only one command per git hook.

If you need multiple verbose commands per git hook, flexible configuration or automatic update of git hooks, please check out the other packages:

- [Lefthook](https://github.com/Arkweid/lefthook)
- [husky](https://github.com/typicode/husky)
- [pre-commit](https://github.com/pre-commit/pre-commit)

## Usage

### Add simple-git-hooks to the project

1. Install simple-git-hooks as a dev dependency:

   ```sh
   npm install simple-git-hooks --save-dev
   ```

2. Add `simple-git-hooks` to your `package.json`. Fill it with git hooks and the corresponding commands.

   For example:

   ```jsonc
   {
     "simple-git-hooks": {
       "pre-commit": "npx lint-staged",
       "pre-push": "cd ../../ && npm run format",

       // All unused hooks will be removed automatically by default
       // but you can use the `preserveUnused` option like following to prevent this behavior

       // if you'd prefer preserve all unused hooks
       "preserveUnused": true,

       // if you'd prefer preserve specific unused hooks
       "preserveUnused": ["commit-msg"]
     }
   }
   ```

   This configuration is going to run all linters on every `commit` and formatter on `push`.

   > There are more ways to configure the package. Check out [Additional configuration options](#additional-configuration-options).

3. Run the CLI script to update the git hooks with the commands from the config:

   ```sh
   # [Optional] These 2 steps can be skipped for non-husky users
   git config core.hooksPath .git/hooks/
   rm -rf .git/hooks

   # Update ./git/hooks
   npx simple-git-hooks
   ```

Now all the git hooks are created.

### Update git hooks command

1. Change the configuration.

2. Run `npx simple-git-hooks` **from the root of your project**.

Note for **yarn2** users: Please run `yarn dlx simple-git-hooks` instead of the command above. More info on [dlx](https://yarnpkg.com/cli/dlx)

Note that you should manually run `npx simple-git-hooks` **every time you change a command**.

### Additional configuration options

You can also add a `.simple-git-hooks.cjs`, `.simple-git-hooks.js`, `simple-git-hooks.cjs`, `simple-git-hooks.js`, `.simple-git-hooks.json` or `simple-git-hooks.json` file to the project and write the configuration inside it.

This way `simple-git-hooks` configuration in `package.json` will not take effect any more.

`.simple-git-hooks.cjs`, `.simple-git-hooks.js` or `simple-git-hooks.cjs`, `simple-git-hooks.js` should look like the following.

```js
module.exports = {
  "pre-commit": "npx lint-staged",
  "pre-push": "cd ../../ && npm run format",
};
```

`.simple-git-hooks.json` or `simple-git-hooks.json` should look like the following.

```json
{
  "pre-commit": "npx lint-staged",
  "pre-push": "cd ../../ && npm run format"
}
```

If you need to have multiple configuration files or just your-own configuration file, you install hooks manually from it by `npx simple-git-hooks ./my-config.js`.

### Uninstall simple-git-hooks

> Uninstallation will remove all the existing git hooks.

```sh
npm uninstall simple-git-hooks
```

## Common issues

### I want to skip git hooks!

You should use `--no-verify` option

https://bobbyhadz.com/blog/git-commit-skip-hooks#skip-git-commit-hooks

If you need to bypass hooks for multiple Git operations, setting the SIMPLE_GIT_HOOKS environment variable can be more convenient. Once set, all subsequent Git operations in the same terminal session will bypass the associated hooks.

```sh
# Set the environment variable
export SIMPLE_GIT_HOOKS=0

# Subsequent Git commands will skip the hooks
git add .
git commit -m "commit message"  # pre-commit hooks are bypassed
git push origin main  # pre-push hooks are bypassed
```

### When migrating from `husky` git hooks are not running

**Why is this happening?**

Husky might change the `core.gitHooks` value to `.husky`, this way, git hooks would search `.husky` directory instead of `.git/hooks/`.

Read more on git configuration in [Git book](https://git-scm.com/docs/githooks)

You can check it by running this command inside of your repo:

`git config core.hooksPath`

If it outputs `.husky` then this is your case

**How to fix?**

you need to point `core.gitHooks` value to `your-awesome-project/.git/hooks`. You can use this command:

`git config core.hooksPath .git/hooks/`

validate the value is set:

`git config core.hooksPath`

should output: `.git/hooks/`

Then remove the `.husky` folder that are generated previously by `husky`.
