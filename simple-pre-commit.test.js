const spc = require("./simple-pre-commit");
const path = require("path")


// Get project root directory

test('getProjectRootDirectory returns correct dir in typical case:', () => {
    expect(spc.getProjectRootDirectory('var/my-project/node_modules/simple-pre-commit')).toBe('var/my-project')
})

test('getProjectRootDirectory returns correct dir when used with windows delimiters:', () => {
    expect(spc.getProjectRootDirectory('user\\allProjects\\project\\node_modules\\simple-pre-commit')).toBe('user/allProjects/project')
})

test('getProjectRootDirectory falls back to undefined when we are not in node_modules:', () => {
    expect(spc.getProjectRootDirectory('var/my-project/simple-pre-commit')).toBe(undefined)
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

const correctPackageJson = {
    devDependencies: {
        "simple-pre-commit":"1.0.0"
    }
}

const correctPackageJson2 = {
    dependencies: {
        "simple-pre-commit":"1.0.0"
    }
}

const incorrectPackageJson = {
    dependencies: {
        "not-our-dependency":"1.0.0"
    },
    devDependencies: {
        "not-our-dependency":"1.0.0"
    }
}

test('returns true if simple pre commit really in devDeps', () => {
    expect(spc.simplePreCommitInDevDependencies(correctPackageJson)).toBe(true)
})

test('returns true if simple pre commit really in deps', () => {
    expect(spc.simplePreCommitInDevDependencies(correctPackageJson2)).toBe(true)
})

test('returns false if simple pre commit isn`t in deps', () => {
    expect(spc.simplePreCommitInDevDependencies(incorrectPackageJson)).toBe(false)
})
