const fs = require('fs')
const os = require("os");
const findGitRoot = require('find-git-root')

/**
 * Checks the 'simple-pre-commit' in dependencies of the project
 * @return {Boolean}
 */
function packageInDevDependencies(packageJsonData) {
    if (!('devDependencies' in packageJsonData)) {
        return false
    }
    return 'simple-pre-commit' in packageJsonData.devDependencies
}

/**
 * Creates or replaces an existing executable script in .git/hooks/pre-commit with provided command
 * @param {string} command
 */
function replaceGitHook(command) {
    const gitRoot = findGitRoot(process.cwd())

    const preCommitHook = "#!/bin/sh" + os.EOL + command

    fs.writeFile(gitRoot + '/hooks/pre-commit', preCommitHook, function (err) {
        if (err) throw err;
    });
}

function postinstall() {
    const targetPackageJson = process.cwd() + '/package.json'

    if (!fs.statSync(targetPackageJson).isFile()) {
        console.log("[ERROR] Was not able to create a pre-commit hook. Reason: package.json doesn't exist")
    }

    const packageJsonDataRaw = fs.readFileSync(targetPackageJson)
    const packageJsonData = JSON.parse(packageJsonDataRaw)

    if (packageInDevDependencies(packageJsonData)) {
        try {
            replaceGitHook("npx lint staged")
        } catch (e) {
            console.log('[ERROR] Was not able to create a pre-commit hook. Reason: ' + e)
        }
    }
}

postinstall()