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

function chmod({mode} = {mode: '644'}) {
  return {
    name: 'chmod',
    onwrite: ({file}) => {
      fs.chmodSync(file, mode);
    }
  };
}

export default {
  input: 'dist/bin/tspm.js',
  output: {
    file: 'dist/bin/tspm',
    format: 'cjs',
    banner: '#! /usr/bin/env node\n'
  },
  plugins: [
    typescriptPathMapping({ tsconfig: true }),
    chmod({ mode: '755' }),
  ],
  context: 'global',
  external
};
