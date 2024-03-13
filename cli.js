#!/usr/bin/env node


/**
 * A CLI tool to change the git hooks to commands from config
 */
const {setHooksFromConfig} = require('./simple-git-hooks')

const {SKIP_INSTALL_SIMPLE_GIT_HOOKS} = process.env

if (['1', 'true'].includes(SKIP_INSTALL_SIMPLE_GIT_HOOKS)) {
    console.log(`[INFO] SKIP_INSTALL_SIMPLE_GIT_HOOKS is set to "${SKIP_INSTALL_SIMPLE_GIT_HOOKS}", skipping installing hook.`)
    return
}

try {
    setHooksFromConfig(process.cwd(), process.argv)
    console.log('[INFO] Successfully set all git hooks')
} catch (e) {
    console.log('[ERROR], Was not able to set git hooks. Error: ' + e)
}
