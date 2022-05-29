#!/usr/bin/env node


/**
 * A CLI tool to change the git hooks to commands from config
 */
const {setHooksFromConfig} = require('./simple-git-hooks')

try {
    const argv = process.argv.slice(2);
    const args = {
        silent: argv.includes('--silent'),
        auto: argv.includes('--auto'),
    }
    setHooksFromConfig(process.cwd(), process.argv, args)
    if (!args.silent) {
        console.log('[INFO] Successfully set all git hooks')
    }
} catch (e) {
    console.log('[ERROR], Was not able to set git hooks. Error: ' + e)
}
