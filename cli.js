#!/usr/bin/env node


/**
 * A CLI tool to change the git hooks to commands from config
 */
const {setHooksFromConfig} = require('./simple-git-hooks')

try {
    setHooksFromConfig(process.cwd())
    console.log('[INFO] Successfully set all git hooks')
} catch (e) {
    console.log('[ERROR], Was not able to set git hooks. Error: ' + e)
}

