module.exports = {
    root: true,
    env: {
        node: true,
    },
    extends: [
        "plugin:vue/essential",
        "eslint:recommended",
        "plugin:prettier/recommended",
    ],
    parserOptions: {
        parser: "@babel/eslint-parser",
    },
    rules: {
        "no-console": process.env.VUE_APP_ENV === "production" ? "warn" : "off",
        "no-debugger":
            process.env.VUE_APP_ENV === "production" ? "warn" : "off",
        "no-undef": "off",
        "no-unused-vars": [
            "error",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrors: "none",
            },
        ],
        "no-empty": ["error", { allowEmptyCatch: true }],
    },
};
