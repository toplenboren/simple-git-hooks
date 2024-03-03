This is just a quick recap of release process:

1. Create a release directory: `yarn create-publish-dist`
2. Inside created directory:
   1. Remove `.tests` file
   2. Remove comments and excessive newlines in `simple-git-hooks.js`, `uninstall.js`, `postinstall.js`
   3. Can use https://beautifier.io, but do not use minification tools
3. Minify `README.md` and remove any other excessive files (Only a `LISENCE.txt`, `README.md`, `package.json` and code files should remain)
4. Check the size: `npm pack`
5. Test the module by installing `.tar` that was output by `npm pack` in some new project
6. If everything is OK:
   1. Change `package.json` version to a new one. Remember to use semver
   2. `npm publish`
   3. Check if new version from `npm` works
   4. Create new Release in GitHub
   5. Update other stuff if needed
