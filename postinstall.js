#!/usr/bin/env node

const {getCommandFromPackageJson, getPackageJson, packageInDevDependencies, setPreCommitHook} = require("./simple-pre-commit");

/**
 * Post-installs the script
 * 1. Creates the pre-commit hook with npx lint-staged command by default
 */
function postinstall() {
    const { packageJsonContent } = getPackageJson()

    if (packageInDevDependencies(packageJsonContent)) {
        try {
            const command = getCommandFromPackageJson()
            if (command === undefined) {
                console.log('[INFO] Please add the pre-commit command to the "simple-pre-commit" field in package.json')
            } else {
                setPreCommitHook("npx lint staged")
            }
        } catch (err) {
            console.log('[ERROR] Was not able to create a pre-commit hook. Reason: ' + err)
        }
    }
}

postinstall()
