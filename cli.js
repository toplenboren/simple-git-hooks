#!/usr/bin/env node


/**
 * A CLI tool to change the git hooks to commands from config
 */
const {setHooksFromConfig, skipInstall} = require('./simple-git-hooks')

if(skipInstall()) {
    return;
}

setHooksFromConfig(process.cwd(), process.argv)
    .then(({ hasContentsChanged }) => {
        if (!hasContentsChanged) {
            // all configured hooks are set but with same contents, silent success
            return
        }
        console.log('[INFO] Successfully set all git hooks')
    })
    .catch(e => console.log('[ERROR], Was not able to set git hooks. Error: ' + e))
