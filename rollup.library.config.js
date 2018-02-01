import fs from 'fs';
import typescriptPathMapping from 'rollup-plugin-typescript-path-mapping';

const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/package.json`, 'utf-8'));
const dependencies = Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.peerDependencies));
const external = dependencies.concat([
  'core-js/modules/es7.symbol.async-iterator',
  'fs',
  'path',
  'process',
  'util'
]);

export default {
  input: 'dist/lib/index.js',
  output: {
    file: 'dist/lib/index.cjs.js',
    format: 'cjs',
    sourcemap: true,
    name: 'ef.carbon.tspm',
    exports: 'named'
  },
  plugins: [
    typescriptPathMapping({ tsconfig: true }),
  ],
  context: 'global',
  external
};
