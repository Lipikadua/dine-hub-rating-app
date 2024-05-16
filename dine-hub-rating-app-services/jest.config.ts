import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testEnvironment: 'node',
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleDirectories: ['node_modules', 'src'],
  testPathIgnorePatterns: ['/node_modules/', 'src/__tests__/testReport/*'],
  coveragePathIgnorePatterns: ['/node_modules/', 'src/__tests__/stubs'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^axios$': require.resolve('axios'),
  },
};

export default config;
