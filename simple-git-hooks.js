const fs = require('fs')
const os = require("os");
const path = require('path');

const VALID_GIT_HOOKS = [
    'applypatch-msg',
    'commit-msg',
    'fsmonitor-watchman',
    'post-update',
    'pre-applypatch',
    'pre-commit',
    'pre-merge-commit',
    'pre-push',
    'pre-rebase',
    'pre-receive',
    'prepare-commit-msg',
    'update'
]

/**
 * Recursively gets the .git folder path from provided directory
 * @param {string} directory
 * @return {string | undefined} .git folder path or undefined if it was not found
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
 * Parses the config and sets git hooks
 * @param {string} projectRootPath
 */
function setHooksFromConfig(projectRootPath) {
    const config = _getConfig(projectRootPath)
    for (let configEntry of config) {
        _setHook(configEntry, config[configEntry])
    }
}

/**
 * Creates or replaces an existing executable script in .git/hooks/<hook> with provided command
 * @param {string} command
 * @param {string} hook
 * @private
 */
function _setHook(command, hook) {
    const gitRoot = getGitProjectRoot(process.cwd())

    const hookCommand = "#!/bin/sh" + os.EOL + command
    const hookPath = path.normalize(gitRoot + '/hooks/' + hook)

    fs.writeFileSync(hookPath, hookCommand)
    fs.chmodSync(hookPath, 0o0755)

    console.log(`[INFO] Successfully set the ${hook} with command: ${command}`)
}

/**
 * Deletes all git hooks
 */
function removeHooks() {
    for (let configEntry of VALID_GIT_HOOKS) {
        _removeHook(configEntry)
    }
}

/**
 * Removes the pre-commit hook from .git/hooks
 * @param {string} hook
 * @private
 */
function _removeHook(hook) {
    const gitRoot = getGitProjectRoot(process.cwd())
    const hookPath = path.normalize(gitRoot + '/hooks/' + hook)

    fs.unlinkSync(hookPath)
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
 * Gets user-set command either from sources
 * First try to get command from .simple-pre-commit.json
 * If not found -> try to get command from package.json
 * @param {string} projectRootPath
 * @throws TypeError if projectRootPath is not string
 * @return {{string: string} | undefined}
 * @private
 */
function _getConfig(projectRootPath) {
    if (typeof projectRootPath !== 'string') {
        throw TypeError("Check project root path! Expected a string, but got " + typeof projectRootPath)
    }

    // every function here should accept projectRootPath as first argument and return either string or undefined
    const sources = [
        () => _getConfigFromFile(projectRootPath, '.simple-git-hooks.json'),
        () => _getConfigFromFile(projectRootPath, 'simple-git-hooks.json'),
        () => _getConfigFromPackageJson(projectRootPath),
    ]

    for (let i = 0; i < sources.length; ++i) {
        let config = sources[i]()
        if (!config) {
            throw('[ERROR] Config was not found! Please add .simple-git-hooks.json. Check README for details')
        }
        if (!_validateConfig(config)) {
            throw('[ERROR] Config was not in correct format. Please check git hooks name')
        }
        return config
    }

    return undefined
}

/**
 * Gets current config from package.json[simple-pre-commit]
 * @param {string} projectRootPath
 * @throws TypeError if packageJsonPath is not a string
 * @throws Error if package.json couldn't be read or was not validated
 * @return {{string: string} | undefined}
 */
function _getConfigFromPackageJson(projectRootPath = process.cwd()) {
    const {packageJsonContent} = _getPackageJson(projectRootPath)
    return packageJsonContent
}

/**
 * Gets user-set config from file
 * Since the file is not required in node.js projects it returns undefined if something is off
 * @param {string} projectRootPath
 * @param {string} fileName
 * @return {{string: string} | undefined}
 */
function _getConfigFromFile(projectRootPath, fileName) {
    if (typeof projectRootPath !== "string") {
        throw TypeError("projectRootPath is not a string")
    }

    if (typeof fileName !== "string") {
        throw TypeError("fileName is not a string")
    }

    try {
        const fileJsonPath = path.normalize(projectRootPath + '/' + fileName)
        const fileJsonRaw = fs.readFileSync(fileJsonPath)
        const fileJson = JSON.parse(fileJsonRaw)
        return fileJson
    } catch (err) {
        return undefined
    }
}

/**
 * Validates the config, checks that every git hook is named correctly
 * @param {{}} config
 * @return {boolean}
 */
function _validateConfig(config) {
    for (let configEntry in config) {
        if (!VALID_GIT_HOOKS.includes(configEntry)) {
            return false
        }
    }
}

module.exports = {
    checkSimplePreCommitInDependencies,
    setHooksFromConfig,
    getProjectRootDirectoryFromNodeModules,
    getGitProjectRoot,
    removeHooks,
}
