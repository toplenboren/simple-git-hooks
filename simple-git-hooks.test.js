const fs = require("fs");
const spc = require("./simple-git-hooks");
const path = require("path");
const { execSync } = require("child_process");
const isEqual = require("lodash.isequal");

const { version: packageVersion } = require("./package.json");

// Get project root directory

describe("getProjectRootDirectory", () => {
  it("returns correct dir in typical case:", () => {
    expect(
      spc.getProjectRootDirectoryFromNodeModules(
        "var/my-project/node_modules/simple-git-hooks"
      )
    ).toBe("var/my-project");
  });

  it("returns correct dir when used with windows delimiters:", () => {
    expect(
      spc.getProjectRootDirectoryFromNodeModules(
        "user\\allProjects\\project\\node_modules\\simple-git-hooks"
      )
    ).toBe("user/allProjects/project");
  });

  it("falls back to undefined when we are not in node_modules:", () => {
    expect(
      spc.getProjectRootDirectoryFromNodeModules(
        "var/my-project/simple-git-hooks"
      )
    ).toBe(undefined);
  });

  it("return correct dir when installed using pnpm:", () => {
    expect(
      spc.getProjectRootDirectoryFromNodeModules(
        `var/my-project/node_modules/.pnpm/simple-git-hooks@${packageVersion}`
      )
    ).toBe("var/my-project");
    expect(
      spc.getProjectRootDirectoryFromNodeModules(
        `var/my-project/node_modules/.pnpm/simple-git-hooks@${packageVersion}/node_modules/simple-git-hooks`
      )
    ).toBe("var/my-project");
  });

  it("return correct dir when installed using yarn3 nodeLinker pnpm:", () => {
    expect(
      spc.getProjectRootDirectoryFromNodeModules(
        `var/my-project/node_modules/.store/simple-git-hooks@${packageVersion}/node_modules/simple-git-hooks`
      )
    ).toBe("var/my-project");
  });
});

// Get git root

describe("getGitProjectRoot", () => {
  const gitProjectRoot = path.normalize(path.join(__dirname, ".git"));
  const currentPath = path.normalize(path.join(__dirname));
  const currentFilePath = path.normalize(path.join(__filename));

  it("works from .git directory itself", () => {
    expect(spc.getGitProjectRoot(gitProjectRoot)).toBe(gitProjectRoot);
  });

  it("works from any directory", () => {
    expect(spc.getGitProjectRoot(currentPath)).toBe(gitProjectRoot);
  });

  it("works from any file", () => {
    expect(spc.getGitProjectRoot(currentFilePath)).toBe(gitProjectRoot);
  });
});

// Check if simple-pre-commit is in devDependencies or dependencies in package json

describe("Check if simple-pre-commit is in devDependencies or dependencies in package json", () => {
  const correctPackageJsonProjectPath = path.normalize(
    path.join(process.cwd(), "_tests", "project_with_simple_pre_commit_in_deps")
  );
  const correctPackageJsonProjectPath_2 = path.normalize(
    path.join(
      process.cwd(),
      "_tests",
      "project_with_simple_pre_commit_in_dev_deps"
    )
  );
  const incorrectPackageJsonProjectPath = path.normalize(
    path.join(process.cwd(), "_tests", "project_without_simple_pre_commit")
  );
  it("returns true if simple pre commit really in devDeps", () => {
    expect(
      spc.checkSimpleGitHooksInDependencies(correctPackageJsonProjectPath)
    ).toBe(true);
  });

  it("returns true if simple pre commit really in deps", () => {
    expect(
      spc.checkSimpleGitHooksInDependencies(correctPackageJsonProjectPath_2)
    ).toBe(true);
  });

  it("returns false if simple pre commit isn`t in deps", () => {
    expect(
      spc.checkSimpleGitHooksInDependencies(incorrectPackageJsonProjectPath)
    ).toBe(false);
  });
});

// Set and remove git hooks

const testsFolder = path.normalize(path.join(process.cwd(), "_tests"));

// Correct configurations

const projectWithConfigurationInPackageJsonPath = path.normalize(
  path.join(testsFolder, "project_with_configuration_in_package_json")
);
const projectWithConfigurationInSeparateCjsPath = path.normalize(
  path.join(testsFolder, "project_with_configuration_in_separate_cjs")
);
const projectWithConfigurationInSeparateJsPath = path.normalize(
  path.join(testsFolder, "project_with_configuration_in_separate_js")
);
const projectWithConfigurationInAlternativeSeparateCjsPath = path.normalize(
  path.join(
    testsFolder,
    "project_with_configuration_in_alternative_separate_cjs"
  )
);
const projectWithConfigurationInAlternativeSeparateJsPath = path.normalize(
  path.join(
    testsFolder,
    "project_with_configuration_in_alternative_separate_js"
  )
);
const projectWithConfigurationInSeparateJsonPath = path.normalize(
  path.join(testsFolder, "project_with_configuration_in_separate_json")
);
const projectWithConfigurationInAlternativeSeparateJsonPath = path.normalize(
  path.join(
    testsFolder,
    "project_with_configuration_in_alternative_separate_json"
  )
);
const projectWithUnusedConfigurationInPackageJsonPath = path.normalize(
  path.join(testsFolder, "project_with_unused_configuration_in_package_json")
);
const projectWithCustomConfigurationFilePath = path.normalize(
  path.join(testsFolder, "project_with_custom_configuration")
);

// Incorrect configurations

const projectWithIncorrectConfigurationInPackageJson = path.normalize(
  path.join(testsFolder, "project_with_incorrect_configuration_in_package_json")
);
const projectWithoutConfiguration = path.normalize(
  path.join(testsFolder, "project_without_configuration")
);

const TEST_SCRIPT = `${spc.PREPEND_SCRIPT}exit 1`;
const COMMON_GIT_HOOKS = { "pre-commit": TEST_SCRIPT, "pre-push": TEST_SCRIPT };

/**
 * Creates .git/hooks dir from root
 * @param {string} root
 */
function createGitHooksFolder(root) {
  if (fs.existsSync(root + "/.git")) {
    return;
  }
  fs.mkdirSync(root + "/.git");
  fs.mkdirSync(root + "/.git/hooks");
}

/**
 * Removes .git directory from root
 * @param {string} root
 */
function removeGitHooksFolder(root) {
  if (fs.existsSync(root + "/.git")) {
    fs.rmdirSync(root + "/.git", { recursive: true });
  }
}

/**
 * Returns all installed git hooks
 * @return { {string: string} }
 */
function getInstalledGitHooks(hooksDir) {
  const result = {};

  const hooks = fs.readdirSync(hooksDir);

  for (let hook of hooks) {
    result[hook] = fs
      .readFileSync(path.normalize(path.join(hooksDir, hook)))
      .toString();
  }

  return result;
}

afterEach(() => {
  [
    projectWithConfigurationInAlternativeSeparateJsPath,
    projectWithConfigurationInAlternativeSeparateCjsPath,
    projectWithConfigurationInSeparateCjsPath,
    projectWithConfigurationInSeparateJsPath,
    projectWithConfigurationInAlternativeSeparateJsonPath,
    projectWithConfigurationInSeparateJsonPath,
    projectWithConfigurationInPackageJsonPath,
    projectWithIncorrectConfigurationInPackageJson,
    projectWithoutConfiguration,
    projectWithConfigurationInPackageJsonPath,
    projectWithUnusedConfigurationInPackageJsonPath,
    projectWithCustomConfigurationFilePath,
  ].forEach((testCase) => {
    removeGitHooksFolder(testCase);
  });
});

describe("Hook Creation with Valid Configurations", () => {
  it("creates git hooks if configuration is correct from .simple-git-hooks.js", () => {
    createGitHooksFolder(projectWithConfigurationInAlternativeSeparateJsPath);

    spc.setHooksFromConfig(projectWithConfigurationInAlternativeSeparateJsPath);
    const installedHooks = getInstalledGitHooks(
      path.normalize(
        path.join(
          projectWithConfigurationInAlternativeSeparateJsPath,
          ".git",
          "hooks"
        )
      )
    );
    expect(isEqual(installedHooks, COMMON_GIT_HOOKS)).toBe(true);
  });

  it("creates git hooks if configuration is correct from .simple-git-hooks.cjs", () => {
    createGitHooksFolder(projectWithConfigurationInAlternativeSeparateCjsPath);

    spc.setHooksFromConfig(
      projectWithConfigurationInAlternativeSeparateCjsPath
    );
    const installedHooks = getInstalledGitHooks(
      path.normalize(
        path.join(
          projectWithConfigurationInAlternativeSeparateCjsPath,
          ".git",
          "hooks"
        )
      )
    );
    expect(isEqual(installedHooks, COMMON_GIT_HOOKS)).toBe(true);
  });

  it("creates git hooks if configuration is correct from simple-git-hooks.cjs", () => {
    createGitHooksFolder(projectWithConfigurationInSeparateCjsPath);

    spc.setHooksFromConfig(projectWithConfigurationInSeparateCjsPath);
    const installedHooks = getInstalledGitHooks(
      path.normalize(
        path.join(projectWithConfigurationInSeparateCjsPath, ".git", "hooks")
      )
    );
    expect(isEqual(installedHooks, COMMON_GIT_HOOKS)).toBe(true);
  });

  it("creates git hooks if configuration is correct from simple-git-hooks.js", () => {
    createGitHooksFolder(projectWithConfigurationInSeparateJsPath);

    spc.setHooksFromConfig(projectWithConfigurationInSeparateJsPath);
    const installedHooks = getInstalledGitHooks(
      path.normalize(
        path.join(projectWithConfigurationInSeparateJsPath, ".git", "hooks")
      )
    );
    expect(isEqual(installedHooks, COMMON_GIT_HOOKS)).toBe(true);
  });

  it("creates git hooks if configuration is correct from .simple-git-hooks.json", () => {
    createGitHooksFolder(projectWithConfigurationInAlternativeSeparateJsonPath);

    spc.setHooksFromConfig(
      projectWithConfigurationInAlternativeSeparateJsonPath
    );
    const installedHooks = getInstalledGitHooks(
      path.normalize(
        path.join(
          projectWithConfigurationInAlternativeSeparateJsonPath,
          ".git",
          "hooks"
        )
      )
    );
    expect(isEqual(installedHooks, COMMON_GIT_HOOKS)).toBe(true);
  });

  it("creates git hooks if configuration is correct from simple-git-hooks.json", () => {
    createGitHooksFolder(projectWithConfigurationInSeparateJsonPath);

    spc.setHooksFromConfig(projectWithConfigurationInSeparateJsonPath);
    const installedHooks = getInstalledGitHooks(
      path.normalize(
        path.join(projectWithConfigurationInSeparateJsonPath, ".git", "hooks")
      )
    );
    expect(isEqual(installedHooks, COMMON_GIT_HOOKS)).toBe(true);
  });

  it("creates git hooks if configuration is correct from package.json", () => {
    createGitHooksFolder(projectWithConfigurationInPackageJsonPath);

    spc.setHooksFromConfig(projectWithConfigurationInPackageJsonPath);
    const installedHooks = getInstalledGitHooks(
      path.normalize(
        path.join(projectWithConfigurationInPackageJsonPath, ".git", "hooks")
      )
    );
    expect(isEqual(installedHooks, { "pre-commit": TEST_SCRIPT })).toBe(true);
  });
});

describe("Tests to fail to create git hooks if configuration is incorrect", () => {
  it("fails to create git hooks if configuration contains bad git hooks", () => {
    createGitHooksFolder(projectWithIncorrectConfigurationInPackageJson);

    expect(() =>
      spc.setHooksFromConfig(projectWithIncorrectConfigurationInPackageJson)
    ).toThrow(
      "[ERROR] Config was not in correct format. Please check git hooks or options name"
    );
  });

  it("fails to create git hooks if not configured", () => {
    createGitHooksFolder(projectWithoutConfiguration);

    expect(() => spc.setHooksFromConfig(projectWithoutConfiguration)).toThrow(
      "[ERROR] Config was not found! Please add `.simple-git-hooks.js` or `simple-git-hooks.js` or `.simple-git-hooks.json` or `simple-git-hooks.json` or `simple-git-hooks` entry in package.json."
    );
  });
});

describe("Hook Removal and Preservation Functionality", () => {
  it("removes git hooks", () => {
    createGitHooksFolder(projectWithConfigurationInPackageJsonPath);

    spc.setHooksFromConfig(projectWithConfigurationInPackageJsonPath);

    let installedHooks = getInstalledGitHooks(
      path.normalize(
        path.join(projectWithConfigurationInPackageJsonPath, ".git", "hooks")
      )
    );
    expect(isEqual(installedHooks, { "pre-commit": TEST_SCRIPT })).toBe(true);

    spc.removeHooks(projectWithConfigurationInPackageJsonPath);

    installedHooks = getInstalledGitHooks(
      path.normalize(
        path.join(projectWithConfigurationInPackageJsonPath, ".git", "hooks")
      )
    );
    expect(isEqual(installedHooks, {})).toBe(true);
  });

  it("creates git hooks and removes unused git hooks", () => {
    createGitHooksFolder(projectWithConfigurationInPackageJsonPath);

    const installedHooksDir = path.normalize(
      path.join(projectWithConfigurationInPackageJsonPath, ".git", "hooks")
    );

    fs.writeFileSync(
      path.resolve(installedHooksDir, "pre-push"),
      "# do nothing"
    );

    let installedHooks = getInstalledGitHooks(installedHooksDir);
    expect(isEqual(installedHooks, { "pre-push": "# do nothing" })).toBe(true);

    spc.setHooksFromConfig(projectWithConfigurationInPackageJsonPath);

    installedHooks = getInstalledGitHooks(installedHooksDir);
    expect(isEqual(installedHooks, { "pre-commit": TEST_SCRIPT })).toBe(true);
  });

  it("creates git hooks and removes unused but preserves specific git hooks", () => {
    createGitHooksFolder(projectWithUnusedConfigurationInPackageJsonPath);

    const installedHooksDir = path.normalize(
      path.join(
        projectWithUnusedConfigurationInPackageJsonPath,
        ".git",
        "hooks"
      )
    );

    fs.writeFileSync(
      path.resolve(installedHooksDir, "commit-msg"),
      "# do nothing"
    );
    fs.writeFileSync(
      path.resolve(installedHooksDir, "pre-push"),
      "# do nothing"
    );

    let installedHooks = getInstalledGitHooks(installedHooksDir);
    expect(
      isEqual(installedHooks, {
        "commit-msg": "# do nothing",
        "pre-push": "# do nothing",
      })
    ).toBe(true);

    spc.setHooksFromConfig(projectWithUnusedConfigurationInPackageJsonPath);

    installedHooks = getInstalledGitHooks(installedHooksDir);
    expect(
      isEqual(installedHooks, {
        "commit-msg": "# do nothing",
        "pre-commit": TEST_SCRIPT,
      })
    ).toBe(true);
  });
});

describe("CLI Command-Based Hook Management", () => {
  const testCases = [
    ["npx", "simple-git-hooks", "./git-hooks.js"],
    ["node", require.resolve(`./cli`), "./git-hooks.js"],
    [
      "node",
      require.resolve(`./cli`),
      require.resolve(`${projectWithCustomConfigurationFilePath}/git-hooks.js`),
    ],
  ];

  testCases.forEach((args) => {
    it(`creates git hooks and removes unused but preserves specific git hooks for command: ${args.join(
      " "
    )}`, () => {
      createGitHooksFolder(projectWithCustomConfigurationFilePath);

      spc.setHooksFromConfig(projectWithCustomConfigurationFilePath, args);
      const installedHooks = getInstalledGitHooks(
        path.normalize(
          path.join(projectWithCustomConfigurationFilePath, ".git", "hooks")
        )
      );
      expect(JSON.stringify(installedHooks)).toBe(JSON.stringify(COMMON_GIT_HOOKS));
      expect(isEqual(installedHooks, COMMON_GIT_HOOKS)).toBe(true);
    });
  });
});

describe("Test env vars", () => {
  const GIT_USER_NAME = "github-actions";
  const GIT_USER_EMAIL = "github-actions@github.com";

  const initializeGitRepository = (path) => {
    execSync(
      `git init \
        && git config user.name ${GIT_USER_NAME} \
        && git config user.email ${GIT_USER_EMAIL}`,
      { cwd: path }
    );
  };

  const performTestCommit = (path, env = process.env) => {
    try {
      execSync(
        'git add . && git commit --allow-empty -m "Test commit" && git commit --allow-empty -am "Change commit msg"',
        {
          cwd: path,
          env: env,
        }
      );
      return false;
    } catch (e) {
      return true;
    }
  };

  beforeEach(() => {
    initializeGitRepository(projectWithConfigurationInPackageJsonPath);
    createGitHooksFolder(projectWithConfigurationInPackageJsonPath);
    spc.setHooksFromConfig(projectWithConfigurationInPackageJsonPath);
  });

  const expectCommitToSucceed = (path) => {
    const errorOccurred = performTestCommit(path);
    expect(errorOccurred).toBe(false);
  };

  const expectCommitToFail = (path) => {
    const errorOccurred = performTestCommit(path);
    expect(errorOccurred).toBe(true);
  };

  describe("SKIP_SIMPLE_GIT_HOOKS", () => {
    afterEach(() => {
      delete process.env.SKIP_SIMPLE_GIT_HOOKS;
    });

    it('commits successfully when SKIP_SIMPLE_GIT_HOOKS is set to "1"', () => {
      process.env.SKIP_SIMPLE_GIT_HOOKS = "1";
      expectCommitToSucceed(projectWithConfigurationInPackageJsonPath);
    });

    it("fails to commit when SKIP_SIMPLE_GIT_HOOKS is not set", () => {
      expectCommitToFail(projectWithConfigurationInPackageJsonPath);
    });

    it('fails to commit when SKIP_SIMPLE_GIT_HOOKS is set to "0"', () => {
      process.env.SKIP_SIMPLE_GIT_HOOKS = "0";
      expectCommitToFail(projectWithConfigurationInPackageJsonPath);
    });

    it("fails to commit when SKIP_SIMPLE_GIT_HOOKS is set to a random string", () => {
      process.env.SKIP_SIMPLE_GIT_HOOKS = "simple-git-hooks";
      expectCommitToFail(projectWithConfigurationInPackageJsonPath);
    });
  })

  describe("SIMPLE_GIT_HOOKS_RC", () => {
    afterEach(() => {
      delete process.env.SIMPLE_GIT_HOOKS_RC;
    });

    it("fails to commit when SIMPLE_GIT_HOOKS_RC is not set", () => {
      expectCommitToFail(projectWithConfigurationInPackageJsonPath);
    });

    it('commits successfully when SIMPLE_GIT_HOOKS_RC points to initrc_that_prevents_hook_fail.sh', () => {
      process.env.SIMPLE_GIT_HOOKS_RC = path.join(projectWithConfigurationInPackageJsonPath, "initrc_that_prevents_hook_fail.sh");
      expectCommitToSucceed(projectWithConfigurationInPackageJsonPath);
    });

    it('fails to commit when SIMPLE_GIT_HOOKS_RC points to initrc_that_does_nothing.sh', () => {
      process.env.SIMPLE_GIT_HOOKS_RC = path.join(projectWithConfigurationInPackageJsonPath, "initrc_that_does_nothing.sh");
      expectCommitToFail(projectWithConfigurationInPackageJsonPath);
    });
  })
});
