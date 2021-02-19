const spc = require("./simple-pre-commit");
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
    expect(spc.checkSimplePreCommitInDependencies(correctPackageJsonProjectPath)).toBe(true)
})

test('returns true if simple pre commit really in deps', () => {
    expect(spc.checkSimplePreCommitInDependencies(correctPackageJsonProjectPath_2)).toBe(true)
})

test('returns false if simple pre commit isn`t in deps', () => {
    expect(spc.checkSimplePreCommitInDependencies(incorrectPackageJsonProjectPath)).toBe(false)
})


// Get command from configuration

const commandInPackageJsonProjectPath = path.normalize(path.join(process.cwd(), '_tests', 'project_with_configuration_in_package_json'))
const commandInSeparateJsonProjectPath = path.normalize(path.join(process.cwd(), '_tests', 'project_with_configuration_in_separate_json'))
const commandInSeparateJsonProjectPath2 = path.normalize(path.join(process.cwd(), '_tests', 'project_with_configuration_in_separate_json_2'))
const notConfiguredProjectPath = path.normalize(path.join(process.cwd(), '_tests', 'project_without_configuration'))

test('returns command if configured from package.json', () => {
    expect(spc.getCommandFromConfig(commandInPackageJsonProjectPath)).toBe("test")
})

test('returns command if configured from simple-pre-commit.json', () => {
    expect(spc.getCommandFromConfig(commandInSeparateJsonProjectPath)).toBe("test")
})

test('returns command if configured from .simple-pre-commit.json', () => {
    expect(spc.getCommandFromConfig(commandInSeparateJsonProjectPath2)).toBe("test")
})

test('returns undefined if were not able to parse command', () => {
    expect(spc.getCommandFromConfig(notConfiguredProjectPath)).toBe(undefined)
})
