#!/usr/bin/env node

const {checkSimplePreCommitInDependencies, getProjectRootDirectoryFromNodeModules, setHooksFromConfig} = require("./simple-git-hooks");


/**
 * Creates the pre-commit from command in config by default
 */
function postinstall() {
    let projectDirectory;

    /* When script is run after install, the process.cwd() would be like <project_folder>/node_modules/simple-git-hooks
       Here we try to get the original project directory by going upwards by 2 levels
       If we were not able to get new directory we assume, we are already in the project root */
    const parsedProjectDirectory = getProjectRootDirectoryFromNodeModules(process.cwd())
    if (parsedProjectDirectory !== undefined) {
        projectDirectory = parsedProjectDirectory
    } else {
        projectDirectory = process.cwd()
    }

    if (checkSimplePreCommitInDependencies(projectDirectory)) {
        try {
            setHooksFromConfig(projectDirectory)
        } catch (err) {
            console.log('[ERROR] Was not able to set git hooks. Reason: ' + err)
        }
    }
}

postinstall()
