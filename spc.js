/** A CLI tool to change the pre-commit command from package.json
 * It really has only one function — to set new pre commit hook.
 * Checks the package.json for simple-pre-commit hook command and sets the found command as hook
 */
const simplePreCommit = require('./simple-pre-commit')

const command = simplePreCommit.getCommandFromPackageJson()
simplePreCommit.setPreCommitHook(command)
