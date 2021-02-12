/** A CLI tool to change the pre-commit command from package.json
 * It really has only one function — to set new pre commit hook.
 * If called without any args -> checks the package.json for simple-pre-commit hook and sets the found command as hook
 * Else if called with arg -> sets the hook from arg, also updating the package.json
 * */

const simplePreCommit = require('./simple-pre-commit')

let command = process.argv.slice(2)[0];

if (command === undefined) {
    command = simplePreCommit.getCommandFromPackageJson()
} else {
    simplePreCommit.setCommandInPackageJson(command)
    simplePreCommit.setPreCommitHook(command)
}