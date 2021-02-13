const fs = require('fs')
const os = require("os");
const path = require('path');
const findGitRoot = require('find-git-root')

/**
 * Transforms the <project>/node_modules/simple-pre-commit to <project>
 * @param projectPath - path to the simple-pre-commit in node modules
 * @return {string | undefined} - an absolute path to the project of undefined if projectPath is not in node_modules
 */
function getProjectRootDirectory(projectPath) {
    function _arraysAreEqual(a1, a2) {
        return JSON.stringify(a1) === JSON.stringify(a2)
    }

    const projDir = projectPath.split(/[\\\/]/) // <- would split both on '/' and '\'

    if (projDir.length > 2 &&
        _arraysAreEqual(projDir.slice(projDir.length - 2, projDir.length), [
            'node_modules',
            'simple-pre-commit'
        ])) {

        return projDir.slice(0, projDir.length - 2).join('/')
    }

    return undefined
}


/**
 * Checks the 'simple-pre-commit' in dependencies of the project
 * @param {Object} packageJsonData
 * @throws TypeError if packageJsonData not an object
 * @return {Boolean}
 */
function simplePreCommitInDevDependencies(packageJsonData) {
    if (typeof packageJsonData !== 'object') {
        throw TypeError("PackageJson is not found")
    }
    // if simple-pre-commit in dependencies -> note user that he should remove move it to devDeps!
    if ('dependencies' in packageJsonData && 'simple-pre-commit' in packageJsonData.dependencies) {
        console.log('[WARN] You should move simple-pre-commit to the devDependencies')
    }
    if (!('devDependencies' in packageJsonData)) {
        return false
    }
    return 'simple-pre-commit' in packageJsonData.devDependencies
}

/** Reads package.json file, returns file buffer
 * @param {string} projectPath - a path to the project, defaults to process.cwd
 * @return {{packageJsonContent: any, packageJsonPath: string}}
 * @throws TypeError if projectPath is not a string
 * @throws Error if cant read package.json
 * @private
 */
function getPackageJson(projectPath = process.cwd()) {
    if (typeof projectPath !== "string") {
        throw TypeError("projectPath is not a string")
    }

    const targetPackageJson = path.normalize(projectPath + '/package.json')

    if (!fs.statSync(targetPackageJson).isFile()) {
        throw Error("Package.json doesn't exist")
    }

    const packageJsonDataRaw = fs.readFileSync(targetPackageJson)
    return { packageJsonContent: JSON.parse(packageJsonDataRaw), packageJsonPath: targetPackageJson }
}

/**
 * Gets current command from package.json[simple-pre-commit]
 * @param {string} packageJsonPath
 * @throws TypeError if packageJsonPath is not a string
 * @throws Error if package.json couldn't be read
 * @return {undefined | string}
 */
function getCommandFromPackageJson(packageJsonPath = process.cwd()) {
    const {packageJsonContent} = getPackageJson(packageJsonPath)
    return packageJsonContent['simple-pre-commit']
}

/**
 * Creates or replaces an existing executable script in .git/hooks/pre-commit with provided command
 * @param {string} command
 */
function setPreCommitHook(command) {
    const gitRoot = findGitRoot(process.cwd())

    const preCommitHook = "#!/bin/sh" + os.EOL + command
    const preCommitHookPath = path.normalize(gitRoot + '/hooks/pre-commit')

    fs.writeFile(preCommitHookPath, preCommitHook, function (err) {
        if (err) throw err;
    });
    fs.chmodSync(preCommitHookPath, 0o0755)
}

module.exports = {
    simplePreCommitInDevDependencies,
    setPreCommitHook,
    getPackageJson,
    getCommandFromPackageJson,
    getProjectRootDirectory
}
