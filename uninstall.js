#!/usr/bin/env node

const {removePreCommitHook} = require("./simple-pre-commit");


/**
 * Removes the pre-commit from command in config by default
 */
function uninstall() {
    console.log("[INFO] Removing pre-commit hook from .git/hooks")

    try {
        removePreCommitHook()
        console.log("[INFO] Successfully removed pre-commit hook")
    } catch (e) {
        console.log("[INFO] Couldn't remove pre-commit hook. Reason: " + e)
    }
}

uninstall()
