module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "strict": ["error", "global"],
        "no-var": "error",
        "prefer-const": "error",
        "one-var": ["error", "never"],
        "camelcase": "error",
        "no-unused-vars": "error",
        "no-multi-assign": "error",
        "no-array-constructor": "error",
        "no-new-wrappers": "error",
        "no-extra-boolean-cast": "error",
        "eqeqeq": "error",
        "yoda": "error",
        "no-nested-ternary": "error"
    }
}
