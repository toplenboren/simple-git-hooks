#!/usr/bin/env node

const {getCommandFromConfig, checkSimplePreCommitInDependencies, getProjectRootDirectoryFromNodeModules, setPreCommitHook} = require("./simple-pre-commit");


/**
 * Creates the pre-commit from command in config by default
 */
function postinstall() {
    let projectDirectory;

    /* When script is run after install, the process.cwd() would be like <project_folder>/node_modules/simple-pre-commit
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
            const command = getCommandFromConfig(projectDirectory)
            if (command === undefined) {
                console.log('[INFO] Please add the pre-commit command to the "simple-pre-commit" field in package.json')
            } else {
                setPreCommitHook(command)
                console.log('[INFO] Set pre-commit hook: ' + command)
            }
        } catch (err) {
            console.log('[ERROR] Was not able to create a pre-commit hook. Reason: ' + err)
        }
    }
}

postinstall()
