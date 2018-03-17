import { Program } from 'estree';
import { PathLike, readFile as readFileSync, writeFile as writeFileSync } from 'fs';
import { ModuleKind } from 'typescript';
import { promisify } from 'util';

import ParseError from '@error/Parse';
import Export from '@es/Export';
import Import from '@es/Import';
import isExportNamedDeclaration from '@es/isExportNamedDeclaration';
import isImportDeclaration from '@es/isImportDeclaration';
import isRequireCallExpression from '@es/isRequireCallExpression';
import isVariableDeclaration from '@es/isVariableDeclaration';
import { attachComments, Comment, generate, parse, plugins, Token } from '@es/parser';
import Require from '@es/Require';
import Base, { IDerivedOptions as IBaseOptions } from '@lib/File';

const readFile = promisify(readFileSync);
const writeFile = promisify(writeFileSync);

export type IOptions = IBaseOptions;

export default class File extends Base<Import | Require, Export> {
  private program: Program | undefined;

  constructor({ ...options }: IOptions) {
    super({...options, extension: '.js'});
    this.program = undefined;
  }

  private get ast(): Promise<Program> {
    if (this.program) {
      return Promise.resolve(this.program);
    } else {
      return (async () => {
        const data = await readFile(this.destination.toString(), 'utf-8');
        try {
            const comments: Array<Comment> = [];
            const tokens: Array<Token> = [];
            const program = parse(data, {
              allowHashBang: true,
              ranges: true,
              onComment: comments,
              onToken: tokens,
              sourceType: this.options.module === ModuleKind.ES2015 ? 'module' : 'script',
              ecmaVersion: 8,
              plugins
            });
            attachComments(program, comments, tokens);
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

  async *imports(): AsyncIterableIterator<Import | Require> {
    const { body } = await this.ast;
    yield* body
      .filter(isImportDeclaration)
      .map(declaration => new Import({file: this, declaration}));
    yield* body
      .filter(isVariableDeclaration)
      .map(({declarations}) => declarations)
      .reduce((a, n) => a.concat(n), [])
      .map(({init}) => init)
      .filter(isRequireCallExpression)
      .map(declaration => new Require({file: this, declaration}));
  }

  async *exports(): AsyncIterableIterator<Export> {
    const { body } = await this.ast;
    yield* body
      .filter(isExportNamedDeclaration)
      .map(declaration => new Export({ file: this, declaration }));
  }

  async write(path?: PathLike | number, options?: {
      encoding?: string | null;
      mode?: number | string;
      flag?: string;
    } | string | null): Promise<void> {
    const ast = await this.ast;
    const data = generate(ast, {comment: true});
    return writeFile((path === undefined) ? this.destination.toString() : path, data, options);
  }
}
