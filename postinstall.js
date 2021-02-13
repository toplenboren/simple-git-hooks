const {setPreCommitHook, packageInDevDependencies, getPackageJson} = require("./simple-pre-commit");

/**
 * Post-installs the script
 * 1. Creates the pre-commit hook with npx lint-staged command by default
 */
function postinstall() {
    const {packageJsonContent} = getPackageJson()

    if (packageInDevDependencies(packageJsonContent)) {
        try {
            setPreCommitHook("npx lint staged")
        } catch (err) {
            console.log('[ERROR] Was not able to create a pre-commit hook. Reason: ' + err)
        }
    }
}

postinstall()
