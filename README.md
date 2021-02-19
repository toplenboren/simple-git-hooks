# simple-pre-commit

![](https://img.shields.io/npm/v/simple-pre-commit) ![](https://img.shields.io/badge/dependencies-zero-green)

A tool, that let you set any command from `package.json` as a pre-commit hook.

- Zero dependency
- Easy to configure (one line in `package.json`)
- Lightweight*:

  | Package name | Unpacked size |
  | ------------- | ------------- |
  | husky v4 `4.3.8` | `53.5 kB`  |
  | husky v5 `5.0.9`  | `24.5 kB`  |
  | pre-commit `1.2.2` | `~80kB` |
  | **simple-pre-commit** `1.1.2` | `10.9 kB` |


### What is pre-commit hook?

Pre-commit hook is a command that is going to be run every time you commit a file to git.
 
If pre-commit hook fails, then commit aborts.

Usually you would like to run `linters` and `code-formatters` on every staged file to ensure code quality in your project

Check out [lint-staged](https://github.com/okonet/lint-staged#readme). It works really well with `simple-pre-commit`

You can look up about git hooks on [git book](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

### When to use it

`simple-pre-commit` works well for small-sized projects when you need quickly setup `pre-commit` hook with one or a few commands and forget about it. 

However, this package only allows you to set the `pre-commit` hook. If you need, for example `pre-push` hook or something else — this package wouln't be able to help you

Also, this package requires you to manually update the pre-commit hook. If you want update pre-commit hook often - this is probably not the best choice 

If you need multiple hooks, flexible configuration or git hook automatic update feature — please check out other packages:
 
* [left-hook](https://github.com/Arkweid/lefthook)
* [husky](https://github.com/Arkweid/lefthook)
* [pre-commit](https://github.com/pre-commit/pre-commit)


## Usage

### Add pre-commit hook to the project:

1. Install the simple-pre-commit as dev dependency 
   
   ```sh
   npm install simple-pre-commit --save-dev
   ```

2. Add the `simple-pre-commit` to your `package.json`. Feed it with any command you would like to run as a pre-commit hook.
   
   ```json
     "simple-pre-commit": "npx lint-staged"`
   ```

   > There are more ways to configure the package. Check out [additional configuration](#Additional configuration options)

3. Run the CLI script to update the git hook with command from `package.json`

   ```sh
   npx simple-pre-commit
   ```
    
Now the command from `package.json` is set up as executable git pre-commit hook. 

### Update a pre-commit hook command

Run `npx simple-pre-commit` **from root of your project**

Note that you should manually run `npx simple-pre-commit` **every time you change the command**


### Additional configuration options

You can also add the `.simple-pre-commit.json` or `simple-pre-commit.json` to the project and write the command inside it, if you do not want to put command inside `package.json`

That way, `.simple-pre-commit.json` or `simple-pre-commit.json` should look like this and `package.json` may not have `simple-pre-commit` configuration inside it

```json
{ 
    "simple-pre-commit":"npx lint staged"
}
```
