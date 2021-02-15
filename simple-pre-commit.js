const fs = require('fs')
const os = require("os");
const path = require('path');

/**
 * Recursively gets the .git folder path from provided directory
 * @param {string} directory
 * @return {string | undefined} .git folder path or undefined if if was not found
 */
function getGitProjectRoot(directory=module.parent.filename) {
    let start = directory
    if (typeof start === 'string') {
        if (start[start.length - 1] !== path.sep) {
            start += path.sep
        }
        start = path.normalize(start)
        start = start.split(path.sep)
    }
    if (!start.length) {
        return undefined
    }
    start.pop()

    let dir = start.join(path.sep)
    let fullPath = path.join(dir, '.git')

    if (fs.existsSync(fullPath)) {
        if(!fs.lstatSync(fullPath).isDirectory()) {
            let content = fs.readFileSync(fullPath, { encoding: 'utf-8' })
            let match = /^gitdir: (.*)\s*$/.exec(content)
            if (match) {
                return path.normalize(match[1])
            }
        }
        return path.normalize(fullPath)
    } else {
        return getGitProjectRoot(start)
    }
}


/**
 * Transforms the <project>/node_modules/simple-pre-commit to <project>
 * @param projectPath - path to the simple-pre-commit in node modules
 * @return {string | undefined} - an absolute path to the project or undefined if projectPath is not in node_modules
 */
function getProjectRootDirectoryFromNodeModules(projectPath) {
    function _arraysAreEqual(a1, a2) {
        return JSON.stringify(a1) === JSON.stringify(a2)
    }

    const projDir = projectPath.split(/[\\/]/) // <- would split both on '/' and '\'

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
 * @param {string} projectRootPath
 * @throws TypeError if packageJsonData not an object
 * @return {Boolean}
 */
function checkSimplePreCommitInDependencies(projectRootPath) {
    if (typeof projectRootPath !== 'string') {
        throw TypeError("Package json path is not a string!")
    }

    const {packageJsonContent} = _getPackageJson(projectRootPath)

    // if simple-pre-commit in dependencies -> note user that he should remove move it to devDeps!
    if ('dependencies' in packageJsonContent && 'simple-pre-commit' in packageJsonContent.dependencies) {
        console.log('[WARN] You should move simple-pre-commit to the devDependencies!')
        return true // We only check that we are in the correct package, e.g not in a dependency of a dependency
    }
    if (!('devDependencies' in packageJsonContent)) {
        return false
    }
    return 'simple-pre-commit' in packageJsonContent.devDependencies
}


/**
 * Gets user-set command either from sources
 * First try to get command from .simple-pre-commit.json
 * If not found -> try to get command from package.json
 * @param {string} projectRootPath
 * @throws TypeError if projectRootPath is not string
 * @return {string | undefined}
 */
function getCommandFromConfig(projectRootPath) {
    if (typeof projectRootPath !== 'string') {
        throw TypeError("Check project root path! Expected a string, but got " + typeof projectRootPath)
    }

    // every function here should accept projectRootPath as first argument and return either string or undefined
    const sources = [
        _getCommandFromSimplePreCommitJson,
        _getCommandFromPackageJson,
    ]

    for (let i = 0; i < sources.length; ++i) {
        let command = sources[i](projectRootPath)
        if (command) {
            return command
        }
    }

    return undefined
}


/**
 * Creates or replaces an existing executable script in .git/hooks/pre-commit with provided command
 * @param {string} command
 */
function setPreCommitHook(command) {
    const gitRoot = getGitProjectRoot(process.cwd())

    const preCommitHook = "#!/bin/sh" + os.EOL + command
    const preCommitHookPath = path.normalize(gitRoot + '/hooks/pre-commit')

    fs.writeFileSync(preCommitHookPath, preCommitHook)
    fs.chmodSync(preCommitHookPath, 0o0755)
}


/** Reads package.json file, returns package.json content and path
 * @param {string} projectPath - a path to the project, defaults to process.cwd
 * @return {{packageJsonContent: any, packageJsonPath: string}}
 * @throws TypeError if projectPath is not a string
 * @throws Error if cant read package.json
 * @private
 */
function _getPackageJson(projectPath = process.cwd()) {
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
 * @param {string} projectRootPath
 * @throws TypeError if packageJsonPath is not a string
 * @throws Error if package.json couldn't be read
 * @return {undefined | string}
 */
function _getCommandFromPackageJson(projectRootPath = process.cwd()) {
    const {packageJsonContent} = _getPackageJson(projectRootPath)
    return packageJsonContent['simple-pre-commit']
}


/**
 * Gets user-set command from simple-pre-commit.json
 * Since the file is not required in node.js projects it returns undefined if something is off
 * @param {string} projectRootPath
 * @return {string | undefined}
 */
function _getCommandFromSimplePreCommitJson(projectRootPath) {
    if (typeof projectRootPath !== "string") {
        throw TypeError("projectRootPath is not a string")
    }

    try {
        const simplePreCommitJsonPath = path.normalize(projectRootPath + '/simple-pre-commit.json')
        const simplePreCommitJsonRaw = fs.readFileSync(simplePreCommitJsonPath)
        const simplePreCommitJson = JSON.parse(simplePreCommitJsonRaw)
        return simplePreCommitJson['simple-pre-commit']
    } catch (err) {
        return undefined
    }
}


module.exports = {
    checkSimplePreCommitInDependencies,
    setPreCommitHook,
    getCommandFromConfig,
    getProjectRootDirectoryFromNodeModules,
    getGitProjectRoot
}
