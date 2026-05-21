/**
 * Minimal type declaration for the `solc` npm package.
 * Covers only the Standard JSON I/O interface used by compileAndDeploy.ts.
 * No @types/solc exists on npm, so this file is the type source.
 */
declare module 'solc' {
  function compile(input: string): string;
  export = { compile };
}
