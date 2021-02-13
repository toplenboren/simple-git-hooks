# simple-pre-commit

A simple tool, that let you set command from `package.json` as a pre-commit hook

## Why?

- Lightweight
- Easy to install
- Dead simple to use

## Getting started:

We set `lint-staged` as a default command. You, however, can use any command you want

1. Install the simple-pre-commit `npm install simple-pre-commit`

2. Add the `simple-pre-commit` to your `package.json`. Feed it with any command you would like to run as a pre-commit hook

3. Run the CLI script to update the git hook with command from `package.json`

    `npx simple-pre-commit update`
