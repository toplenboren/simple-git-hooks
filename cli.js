#!/usr/bin/env node

const os = require('os')

/** A CLI tool to change the pre-commit command from package.json
 * It really has only one function — to set new pre commit hook.
 * Checks the package.json for simple-pre-commit hook command and sets the found command as hook
 */
const {getCommandFromConfig, setPreCommitHook} = require('./simple-pre-commit')

const command = getCommandFromConfig(process.cwd())

if (!command) {
    console.log(`Couldn't parse command! Please add command to package.json or .simple-pre-commit.json. See README.md for details`)
    os.exit(1)
}

setPreCommitHook(command)

console.log('Set pre commit hooK: ' + command)
