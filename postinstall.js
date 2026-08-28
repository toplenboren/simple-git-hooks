#!/usr/bin/env node

const {checkSimpleGitHooksInDependencies, getProjectRootDirectory, setHooksFromConfig, skipInstall} = require("./simple-git-hooks");


/**
 * Creates the pre-commit from command in config by default
 */
async function postinstall() {

    if(skipInstall()) {
        return;
    }

    /* When the script is run after install, process.cwd() is the package's own
       location inside node_modules (e.g. <project>/node_modules/simple-git-hooks,
       or <project>/node_modules/.pnpm/... for isolated stores). getProjectRootDirectory
       recovers the real project root — preferring INIT_CWD, which package managers
       set to the install directory, and falling back to walking up from cwd. */
    const projectDirectory = getProjectRootDirectory()

    if (checkSimpleGitHooksInDependencies(projectDirectory)) {
        try {
            await setHooksFromConfig(projectDirectory)
        } catch (err) {
            console.log('[ERROR] Was not able to set git hooks. Reason: ' + err)
        }
    }
}

postinstall()
