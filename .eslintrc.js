module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
    },
    plugins: ["@typescript-eslint"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
    ],
    rules: {
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
        "@typescript-eslint/no-unused-vars": "off",
        eqeqeq: [
            "error",
            "always",
            {
                null: "never",
            },
        ],
    },
    ignorePatterns: ["*.js"],
};
