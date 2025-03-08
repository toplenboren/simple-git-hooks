module.exports = {
    "env": {
        "commonjs": true,
        "es2021": true,
        "node": true,
        "jest": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12
    },
    "overrides": [
        {
            "files": ["*.mjs"],
            "parserOptions": {
                "sourceType": "module"
            }
        }
    ]
};
