declare module 'react-test-renderer';

// Minimal Jest globals so the test file typechecks without installing @types/jest
declare var test: (name: string, fn: () => void | Promise<void>) => void;
declare var it: (name: string, fn: () => void | Promise<void>) => void;
declare var describe: (name: string, fn: () => void) => void;
declare var expect: any;

// Allow importing non-typed assets in tests
declare module '*.png';
declare module '*.jpg';
