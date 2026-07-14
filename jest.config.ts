import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
    dir: './',
});

/** @type {import('jest').Config} */
const config: Config = {
    testEnvironment: 'jsdom',
    coverageProvider: 'v8',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },

    collectCoverageFrom: [
        'app/**/*.{ts,tsx}',
        'utils/**/*.{ts,tsx}',
        '!**/*.test.{ts,tsx}',
        '!**/*.spec.{ts,tsx}',
        '!**/*.d.ts',
    ],
};

export default createJestConfig(config);
