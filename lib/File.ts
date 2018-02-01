import * as acorn from 'acorn';
import * as escodegen from 'escodegen';
// tslint:disable-next-line:no-implicit-dependencies
import * as estree from 'estree';
import * as fs from 'fs';
import * as ts from 'typescript';
import { promisify } from 'util';

import ParseError from '@lib/error/Parse';
import Export from '@lib/Export';
import Import from '@lib/Import';
import Path from '@lib/Path';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export interface IOptions {
  path: string | Path;
  options: ts.CompilerOptions;
}

export default class File {
  readonly source: Path;
  readonly options: ts.CompilerOptions;
  private program: estree.Program | undefined;

  constructor({ path, options }: IOptions) {
    this.source = new Path(path.toString());
    this.options = options;
  }

  get isMapped(): Promise<boolean> {
    return (async () => {
      let mapped = false;
      for await (const imprt of this.imports()) {
        mapped = mapped || await imprt.isMapped;
      }
      for await (const imprt of this.exports()) {
        mapped = mapped || await imprt.isMapped;
      }
      return mapped;
    })();
  }

  get ast(): Promise<estree.Program> {
    if (this.program) {
      return Promise.resolve(this.program);
    } else {
      return (async () => {
        const data = await readFile(this.destination.toString(), 'utf-8');
        try {
            const comments: Array<acorn.Comment> = [];
            const tokens: Array<acorn.Token> = [];
            const program = acorn.parse(data, {
              allowHashBang: true,
              ranges: true,
              onComment: comments,
              onToken: tokens,
              sourceType: 'module',
              ecmaVersion: 8,
            });
            escodegen.attachComments(program, comments, tokens);
            return this.program = program;
        } catch (error) {
          if (error instanceof SyntaxError) {
            throw new ParseError({file: this, error, data});
          } else {
            throw error;
          }
        }
      })();
    }
  }

  async *imports(): AsyncIterableIterator<Import> {
    const { body } = await this.ast;
    yield* body
      .filter(({type}) => type === 'ImportDeclaration')
      .map(n => new Import({file: this, declaration: n as estree.ImportDeclaration}));
  }

  async *exports(): AsyncIterableIterator<Export> {
    const { body } = await this.ast;
    yield* body
      .filter(n =>
        n.type === 'ExportAllDeclaration' ||
        (n.type === 'ExportNamedDeclaration' && (n).source !== null))
      .map(n => new Export({
        file: this,
        declaration: n.type === 'ExportAllDeclaration' ?
          n :
          n as estree.ExportNamedDeclaration,
      }));
  }

  get destination(): Path {
    const { outDir, rootDir } = this.options;

    if (!outDir) {
      throw new TypeError(`Only 'outDir' is supported`);
    }

    const out = new Path(outDir);
    const destination = out.join(this.source.relative(rootDir));
    destination.extension = '.js';
    return destination;
  }

  async write(path?: fs.PathLike | number, options?: {
    encoding?: string | null;
    mode?: number | string;
    flag?: string;
  } | string | null): Promise<void> {
    const ast = await this.ast;
    const data = escodegen.generate(ast, {comment: true});
    return writeFile((path === undefined) ? this.destination.toString() : path, data, options);
  }

  async *map(options: ts.CompilerOptions): AsyncIterableIterator<Import | Export> {
    for await (const imprt of this.imports()) {
      const mapped = await imprt.map(options);
      if (mapped) {
        yield imprt;
      }
    }
    for await (const exprt of this.exports()) {
      const mapped = await exprt.map(options);
      if (mapped) {
        yield exprt;
      }
    }
  }

  toString(): string {
    return this.destination.toString();
  }
}
