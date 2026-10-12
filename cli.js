#!/usr/bin/env node


/**
 * A CLI tool to change the git hooks to commands from config
 */
const {setHooksFromConfig, skipInstall, isInsideNodeModules} = require('./simple-git-hooks')

if(skipInstall()) {
    return;
}

// When a dependency runs this CLI from its own install script, the working
// directory is inside the parent's node_modules; installing from there would
// write into (and prune) the parent's hooks, so skip.
if (isInsideNodeModules()) {
    console.log('[INFO] Current working directory is inside `node_modules`, skipping installing git hooks.')
    return;
}

setHooksFromConfig(process.cwd(), process.argv)
    .then(({ isHookChanged }) => {
        if (!isHookChanged) {
            // all configured hooks are set but with same contents, silent success
            return
        }
        console.log('[INFO] Successfully set all git hooks')
    })
    .catch(e => console.log('[ERROR], Was not able to set git hooks. Error: ' + e))
