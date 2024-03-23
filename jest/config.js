module.exports = {
    preset: "ts-jest",
    rootDir: "../",
    testEnvironment: "node",
    setupFilesAfterEnv: ["<rootDir>/jest/setup.ts"],
    collectCoverageFrom: [
        "src/app/**/*.tsx",
        "src/pages/**/*.tsx",
        "!src/pages/**/index.tsx",
        "src/components/**/*.tsx",
        "src/store/**/*.ts",
        "!src/store/index.ts",
        "!src/store/rootReducer.ts",
    ],
    moduleNameMapper: {
        ".*\\.(css|scss|sass)$": "<rootDir>/jest/styleMock.ts",
        ".*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
            "<rootDir>/jest/assetMock.ts",
    },
    globals: {
        API_URL: "http://localhost:3000",
        DEV: true,
        SSR: false,
        REGISTER_DISCORD_COMMANDS: false,
        TEST: true,
    },
    maxConcurrency: 50,
    maxWorkers: 1,
}
