import { Comment, parse, Token } from 'acorn';
import { attachComments, generate } from 'escodegen';
import { ExportNamedDeclaration, ImportDeclaration, Program } from 'estree';
import { PathLike, readFile as readFileSync, writeFile as writeFileSync } from 'fs';
import { promisify } from 'util';

import ParseError from '@error/Parse';
import Export from '@es/Export';
import Import from '@es/Import';
import Base, { IDerivedOptions as IBaseOptions } from '@lib/File';

const readFile = promisify(readFileSync);
const writeFile = promisify(writeFileSync);

export type IOptions = IBaseOptions;

export default class File extends Base<Import, Export> {
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
              sourceType: 'module',
              ecmaVersion: 8,
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

  async *imports(): AsyncIterableIterator<Import> {
    const { body } = await this.ast;
    yield* body
      .filter(({type}) => type === 'ImportDeclaration')
      .map(n => new Import({file: this, declaration: n as ImportDeclaration}));
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
          n as ExportNamedDeclaration,
      }));
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
