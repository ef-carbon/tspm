// tslint:disable-next-line:no-any
let acorn: any;

// tslint:disable-next-line:no-any
let escodegen: any;

// tslint:disable-next-line:no-any
let estraverse: any;

const plugins: { jsx?: boolean } = {};

try {
  // tslint:disable-next-line:no-var-requires no-require-imports
  acorn = require('acorn-jsx');

  // tslint:disable-next-line:no-var-requires no-require-imports
  escodegen = require('escodegen-wallaby');

  // tslint:disable-next-line:no-var-requires no-require-imports
  estraverse = require('estraverse-fb');

  plugins.jsx = true;
} catch ({message}) {
  if (process.env.EF_TSPM_SHOW_JSX_LOADING_WARNING) {
    process.stderr.write(`${message}\n`);
  }

  // tslint:disable-next-line:no-var-requires no-require-imports
  acorn = require('acorn');

  // tslint:disable-next-line:no-var-requires no-require-imports
  escodegen = require('escodegen');

  // tslint:disable-next-line:no-var-requires no-require-imports
  estraverse = require('estraverse');
}

export type Comment = acorn.Comment;
export type Token = acorn.Token;
export const parse = acorn.parse;
export const generate = escodegen.generate;
export const attachComments = estraverse.attachComments;
export const traverse = estraverse.traverse;
export { plugins };
