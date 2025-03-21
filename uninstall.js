#!/usr/bin/env node

const {removeHooks} = require("./simple-git-hooks");


/**
 * Removes the pre-commit from command in config by default
 */
async function uninstall() {
    console.log("[INFO] Removing git hooks from .git/hooks")

    try {
        await removeHooks()
        console.log("[INFO] Successfully removed all git hooks")
    } catch (e) {
        console.log("[INFO] Couldn't remove git hooks. Reason: " + e)
    }
}

uninstall()
