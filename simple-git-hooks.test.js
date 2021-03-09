const fs = require('fs')
const os = require('os')
const spc = require("./simple-git-hooks");
const path = require("path")


// Get project root directory

test('getProjectRootDirectory returns correct dir in typical case:', () => {
    expect(spc.getProjectRootDirectoryFromNodeModules('var/my-project/node_modules/simple-pre-commit')).toBe('var/my-project')
})

test('getProjectRootDirectory returns correct dir when used with windows delimiters:', () => {
    expect(spc.getProjectRootDirectoryFromNodeModules('user\\allProjects\\project\\node_modules\\simple-pre-commit')).toBe('user/allProjects/project')
})

test('getProjectRootDirectory falls back to undefined when we are not in node_modules:', () => {
    expect(spc.getProjectRootDirectoryFromNodeModules('var/my-project/simple-pre-commit')).toBe(undefined)
})


// Get git root

const gitProjectRoot = path.normalize(path.join(__dirname, '.git'))
const currentPath = path.normalize(path.join(__dirname))
const currentFilePath = path.normalize(path.join(__filename))

test('get git root works from .git directory itself', () => {
    expect(spc.getGitProjectRoot(gitProjectRoot)).toBe(gitProjectRoot)
})

test('get git root works from any directory', () => {
    expect(spc.getGitProjectRoot(currentPath)).toBe(gitProjectRoot)
})

test('get git root works from any file', () => {
    expect(spc.getGitProjectRoot(currentFilePath)).toBe(gitProjectRoot)
})


// Check if simple-pre-commit is in devDependencies or dependencies in package json

const correctPackageJsonProjectPath = path.normalize(path.join(process.cwd(), '_tests', 'project_with_simple_pre_commit_in_deps'))
const correctPackageJsonProjectPath_2 = path.normalize(path.join(process.cwd(), '_tests', 'project_with_simple_pre_commit_in_dev_deps'))
const incorrectPackageJsonProjectPath = path.normalize(path.join(process.cwd(), '_tests', 'project_without_simple_pre_commit'))

test('returns true if simple pre commit really in devDeps', () => {
    expect(spc.checkSimpleGitHooksInDependencies(correctPackageJsonProjectPath)).toBe(true)
})

test('returns true if simple pre commit really in deps', () => {
    expect(spc.checkSimpleGitHooksInDependencies(correctPackageJsonProjectPath_2)).toBe(true)
})

test('returns false if simple pre commit isn`t in deps', () => {
    expect(spc.checkSimpleGitHooksInDependencies(incorrectPackageJsonProjectPath)).toBe(false)
})


// Set git hooks

const testsFolder = path.normalize(path.join(process.cwd(), '_tests'))

// Correct configurations

const projectWithConfigurationInPackageJsonPath = path.normalize(path.join(testsFolder, 'project_with_configuration_in_package_json'))
const projectWithConfigurationInSeparateJsonPath = path.normalize(path.join(testsFolder, 'project_with_configuration_in_separate_json'))
const projectWithConfigurationInAlternativeSeparateJsonPath = path.normalize(path.join(testsFolder, 'project_with_configuration_in_alternative_separate_json'))

// Incorrect configurations

const projectWithIncorrectConfigurationInPackageJson = path.normalize(path.join(testsFolder, 'project_with_incorrect_configuration_in_package_json'))
const projectWithoutConfiguration = path.normalize(path.join(testsFolder, 'project_without_configuration'))

/**
 * Creates .git/hooks dir from root
 * @param {string} root
 */
function createGitHooksFolder(root) {
    if (fs.existsSync(root + '/.git')) {
        return
    }
    fs.mkdirSync(root + '/.git')
    fs.mkdirSync(root + '/.git/hooks')
}

/**
 * Removes .git directory from root
 * @param {string} root
 */
function removeGitHooksFolder(root) {
    if (fs.existsSync(root + '/.git')) {
        fs.rmdirSync(root + '/.git', { recursive: true })
    }
}

/**
 * Returns all installed git hooks
 * @return { string: string }
 */
function getInstalledGitHooks(hooksDir) {
    const result = {}

    const hooks = fs.readdirSync(hooksDir)

    for (let hook of hooks) {
        const hookCode = fs.readFileSync(path.normalize(path.join(hooksDir, hook))).toString()
        result[hook] = hookCode
    }

    return result
}

test('creates git hooks if configuration is correct from package.json', () => {
    createGitHooksFolder(projectWithConfigurationInPackageJsonPath)

    spc.setHooksFromConfig(projectWithConfigurationInPackageJsonPath)
    const installedHooks = getInstalledGitHooks(path.normalize(path.join(projectWithConfigurationInPackageJsonPath, '.git', 'hooks')))
    expect(JSON.stringify(installedHooks)).toBe(JSON.stringify({'pre-commit':`#!/bin/sh${os.EOL}exit 1`}))

    removeGitHooksFolder(projectWithConfigurationInPackageJsonPath)
})

test('creates git hooks if configuration is correct from simple-git-hooks.json', () => {
    createGitHooksFolder(projectWithConfigurationInSeparateJsonPath)

    spc.setHooksFromConfig(projectWithConfigurationInSeparateJsonPath)
    const installedHooks = getInstalledGitHooks(path.normalize(path.join(projectWithConfigurationInSeparateJsonPath, '.git', 'hooks')))
    expect(JSON.stringify(installedHooks)).toBe(JSON.stringify({'pre-push':`#!/bin/sh${os.EOL}exit 1`, 'pre-commit':`#!/bin/sh${os.EOL}exit 1`}))

    removeGitHooksFolder(projectWithConfigurationInSeparateJsonPath)
})
