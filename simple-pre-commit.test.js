const {getProjectRootDirectory} = require("./simple-pre-commit");

// Get project root directory

test('getProjectRootDirectory returns correct dir in typical case:', () => {
    expect(getProjectRootDirectory('var/my-project/node_modules/simple-pre-commit')).toBe('var/my-project')
})

test('getProjectRootDirectory falls back to undefined when we are not in node_modules:', () => {
    expect(getProjectRootDirectory('var/my-project/simple-pre-commit')).toBe(undefined)
})
