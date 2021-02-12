import * as fs from "fs";
import {getPackageJson} from "./simple-pre-commit";

const {setPreCommitHook} = require("./simple-pre-commit");
const {packageInDevDependencies} = require("./simple-pre-commit");

function postinstall() {
    const { packageJsonContent } = getPackageJson()

    if (packageInDevDependencies(packageJsonContent)) {
        try {
            setPreCommitHook("npx lint staged")
        } catch (e) {
            console.log('[ERROR] Was not able to create a pre-commit hook. Reason: ' + e)
        }
    }
}

postinstall()