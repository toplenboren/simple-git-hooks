#!/usr/bin/env node

const {getCommandFromPackageJson, getPackageJson, simplePreCommitInDevDependencies, getProjectRootDirectory, setPreCommitHook } = require("./simple-pre-commit");


/**
 * Creates the pre-commit hook with npx lint-staged command by default
 */
function postinstall() {
    let projectDirectory = process.cwd()

    /* When script is run after install, the process.cwd() would be like <project_folder>/node_modules/simple-pre-commit
       Here we try to get the original project directory by going upwards by 2 levels
       If we were not able to get new directory we assume, we are already in the project root */
    const parsedProjectDirectory = getProjectRootDirectory(process.cwd())
    if (parsedProjectDirectory !== undefined) {
        projectDirectory = parsedProjectDirectory
    }

    const { packageJsonContent } = getPackageJson(projectDirectory)

    if (simplePreCommitInDevDependencies(packageJsonContent)) {
        try {
            const command = getCommandFromPackageJson(projectDirectory)
            if (command === undefined) {
                console.log('[INFO] Please add the pre-commit command to the "simple-pre-commit" field in package.json')
            } else {
                setPreCommitHook(command)
            }
        } catch (err) {
            console.log('[ERROR] Was not able to create a pre-commit hook. Reason: ' + err)
        }
    }
}

postinstall()
