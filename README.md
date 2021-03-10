# simple-git-hooks


 ![](https://img.shields.io/badge/dependencies-zero-green)

A tool, that lets you easily manage git hooks

> The package was recently renamed from `simple-pre-commit`, see **releases** for `simple-pre-commit` documentation

- Zero dependency
- Easy to configure (one line in `package.json`)
- Lightweight*:

  | Package name | Unpacked size |
  | ------------- | ------------- |
  | husky v4 `4.3.8` | `53.5 kB`  |
  | husky v5 `5.0.9`  | `24.5 kB`  |
  | pre-commit `1.2.2` | `~80 kB` |
  | **simple-git-hooks** `2.0.0` | `~10 kB` |


### What is git hook?

Git hook is a command or script that is going to be run every time you perform a git action, like `git commit` or `git push`.
 
If git hook execution fails, then commit aborts.

For example, if you want to run `linter` on every commit to ensure code quality in your project, then you can create `pre-commit` hook which would call `npx lint staged`

Check out [lint-staged](https://github.com/okonet/lint-staged#readme). It works really well with `simple-git-hooks`

You can look up about git hooks on [git book](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

### When to use it

`simple-git-hooks` works well for small-sized projects when you need quickly setup hooks and forget about it. 

However, this package requires you to manually update git hooks. If you update git hooks often - this is probably not the best choice 

Also, this package allows you to set only one command per git hook. 

If you need verbose multiple hooks per git hook, flexible configuration or git hook automatic update feature — please check out other packages:
 
* [Lefthook](https://github.com/Arkweid/lefthook)
* [husky](https://github.com/typicode/husky)
* [pre-commit](https://github.com/pre-commit/pre-commit)


## Usage

### Add simple-git-hooks to the project:

1. Install the simple-git-hooks as dev dependency 
   
   ```sh
   npm install simple-git-hooks --save-dev
   ```

2. Add the `simple-git-hooks` to your `package.json`. Fill it with git hooks and corresponding commands. 

    For example:
   
   ```json
     "simple-git-hooks": {
       "pre-commit": "npx lint-staged",
       "pre-push": "cd ../../ && npm run format"
     }     
   ```
    
    This configuration is going to run all linters on every `commit` and formatter on `push`
    
   > There are more ways to configure the package. Check out [additional configuration](#Additional configuration options)
    
3. Run the CLI script to update the git hooks with commands from config

   ```sh
   npx simple-git-hooks
   ```
    
Now all git hooks are created

### Update git hooks command

1. Change the configuration

2. Run `npx simple-git-hooks` **from root of your project**

Note that you should manually run `npx simple-git-hooks` **every time you change the command**


### Additional configuration options

You can also add the `.simple-git-hooks.json` or `simple-git-hooks.json` to the project and write the configuration inside it

That way, `.simple-git-hooks.json` or `simple-git-hooks.json` should look like this and `package.json` may not have `simple-git-hooks` configuration inside it

```json
{ 
    "pre-commit":"npx lint staged",
    "pre-push": "cd ../../ && npm run format"
}
```

### Uninstall pre-commit-hook

> Uninstallation will remove all existing git hooks

```sh
npm uninstall --save-dev simple-git-hooks
```
