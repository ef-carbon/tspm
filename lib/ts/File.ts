import { PathLike, readFile as readFileSync, writeFile as writeFileSync } from 'fs';
import {
  createPrinter,
  createSourceFile,
  EmitHint,
  ExportDeclaration,
  ImportDeclaration,
  ScriptTarget,
  SourceFile,
  SyntaxKind,
} from 'typescript';
import { promisify } from 'util';

import ParseError from '@error/Parse';
import Base, { IDerivedOptions as IBaseOptions } from '@lib/File';
import Export from '@ts/Export';
import Import from '@ts/Import';

const readFile = promisify(readFileSync);
const writeFile = promisify(writeFileSync);

export type IOptions = IBaseOptions;

export default class File extends Base<Import, Export> {
  private sourceFile: SourceFile | undefined;

  constructor({ ...options }: IOptions) {
    super({...options, extension: '.d.ts'});
    this.sourceFile = undefined;
  }

  private get ast(): Promise<SourceFile> {
    if (this.sourceFile) {
      return Promise.resolve(this.sourceFile);
    } else {
      return (async () => {
        const data = await readFile(this.destination.toString(), 'utf-8');
        try {
          return this.sourceFile = createSourceFile(this.destination.toString(), data, ScriptTarget.Latest);
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
    const { statements } = await this.ast;
    yield* statements
      .filter(({kind}) => kind === SyntaxKind.ImportDeclaration)
      .map(n => new Import({file: this, declaration: n as ImportDeclaration}));
  }

  async *exports(): AsyncIterableIterator<Export> {
    const { statements } = await this.ast;
    yield* statements
      .filter(({kind}) => kind === SyntaxKind.ExportDeclaration)
      .filter(n => (n as ExportDeclaration).moduleSpecifier)
      .map(n => new Export({file: this, declaration: n as ExportDeclaration}));
  }

  async write(path?: PathLike | number, options?: {
      encoding?: string | null;
      mode?: number | string;
      flag?: string;
    } | string | null): Promise<void> {
    const sourceFile = await this.ast;
    const { newLine } = this.options;
    const printer = createPrinter({ newLine });
    const data = printer.printNode(EmitHint.SourceFile, sourceFile, sourceFile);
    return writeFile((path === undefined) ? this.destination.toString() : path, data, options);
  }
}
