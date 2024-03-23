module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "airbnb",
        "airbnb/hooks",
        "plugin:@typescript-eslint/recommended",
        "plugin:jest/recommended",
        "plugin:jest/style",
        "plugin:jest-dom/recommended",
        "plugin:testing-library/react",
        "prettier",
    ],
    plugins: ["@typescript-eslint", "jest", "jest-dom", "testing-library"],
    settings: {
        "import/resolver": {
            typescript: {},
        },
    },
    env: {
        browser: true,
        node: true,
        es6: true,
        jest: true,
    },
    rules: {
        "global-require": "off",
        "no-use-before-define": "off",
        "no-console": "off",
        "no-underscore-dangle": "off",
        "no-param-reassign": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-props-no-spreading": "off",
        "react/no-unescaped-entities": "off",
        "react/jsx-filename-extension": [
            "error",
            {
                extensions: [".js", ".jsx", ".ts", ".tsx"],
            },
        ],
        "import/extensions": "off",
        "import/no-extraneous-dependencies": [
            "error",
            {
                devDependencies: true,
            },
        ],
        "import/prefer-default-export": "off",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
        "testing-library/no-node-access": "off",
        "testing-library/render-result-naming-convention": "off",
        "jsx-a11y/label-has-associated-control": "off",
        "jsx-a11y/control-has-associated-label": "off",
    },
    globals: {
        API_URL: false,
        SSR: true,
        DEV: true,
        REGISTER_DISCORD_COMMANDS: false,
        TEST: false,
    },
}
