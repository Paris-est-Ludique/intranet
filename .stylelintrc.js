module.exports = {
    plugins: ["stylelint-order"],
    extends: [
        "stylelint-config-standard",
        "stylelint-config-sass-guidelines",
        "stylelint-config-prettier",
    ],
    ignoreFiles: ["public/assets/**/*.css", "coverage/**/*.css"],
    rules: {
        "order/properties-alphabetical-order": undefined,
        "selector-class-pattern": [
            "^[A-Za-z0-9\\-]+$",
            {
                message:
                    "Selector should be written with alphanumeric characters only (selector-class-pattern)",
            },
        ],
        "selector-no-qualifying-type": [
            true,
            {
                ignore: ["attribute"],
            },
        ],
    },
}
