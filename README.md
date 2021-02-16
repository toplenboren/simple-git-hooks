# simple-pre-commit

A tool, that let you set any command from `package.json` as a pre-commit hook.

## Why?

- Zero dependency
- Lightweight
- Easy to install
- Dead simple to use

## Add pre-commit hook to the project:

1. Install the simple-pre-commit as dev dependency 
   
   ```sh
   npm install simple-pre-commit --save-dev
   ```

2. Add the `simple-pre-commit` to your `package.json`. Feed it with any command you would like to run as a pre-commit hook. 
   
   ```json
     "simple-pre-commit": "npx lint-staged"`
   ```

3. Run the CLI script to update the git hook with command from `package.json`

   ```sh
   npx simple-pre-commit
   ```
    
Now the command from `package.json` is set up as executable git pre-commit hook. 
You can look up about git hooks [here](https://git-scm.com/book/en/v2/Customizing-Git-Git-Hooks)

## Updating a pre-commit hook command

Run `npx simple-pre-commit` **from root of your project**

Note that you should manually run `npx simple-pre-commit` every time you change the command


## Additional configuration options

You can also add the `.simple-pre-commit.json` to the project and write the command inside it, if you do not want to put command inside `package.json`

That way, `.simple-pre-commit.json` should look like this and `package.json` may not have `simple-pre-commit` configuration inside it

```(json)
{ 
    "simple-pre-commit":"npx lint staged"
}
```
