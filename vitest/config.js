export default {
  preset: 'ts-jest',
  rootDir: '../',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest/setup.ts'],
  collectCoverageFrom: [
    'src/app/**/*.tsx',
    'src/pages/**/*.tsx',
    '!src/pages/**/index.tsx',
    'src/components/**/*.tsx',
    'src/store/**/*.ts',
    '!src/store/index.ts',
    '!src/store/rootReducer.ts',
  ],
  moduleNameMapper: {
    '.*\\.(css|scss|sass)$': '<rootDir>/jest/styleMock.ts',
    '.*\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/jest/assetMock.ts',
  },
  globals: {
    __DEV__: true,
    __CLIENT__: true,
    __SERVER__: false,
    __LOCAL__: false,
    __REGISTER_DISCORD_COMMANDS__: false,
    __TEST__: true,
  },
  maxConcurrency: 50,
  maxWorkers: 1,
}
