import { ExportDeclaration,  ImportDeclaration, StringLiteral, SyntaxKind } from 'typescript';

import Base, { IDerivedOptions as IBaseOptions } from '@lib/Declaration';

export type Interface = ExportDeclaration | ImportDeclaration;

export type IOptions<T extends Interface> = IBaseOptions<T>;

export default class Declaration<T extends Interface> extends Base<T> {
  constructor({ declaration, file, ...rest}: IOptions<T>) {
    // RAII checks
    if (!declaration.moduleSpecifier) {
      throw new TypeError(`No TS module specifier in '${file.source}'`);
    }
    const { kind, text } = (declaration.moduleSpecifier as StringLiteral);
    if (kind !== SyntaxKind.StringLiteral) {
      throw new TypeError(`Invalid TS declaration literal kind '${kind}' in '${file.source}'`);
    }

    super({declaration, file, ...rest, path: text});
  }

  private get literal(): StringLiteral {
    return (this.declaration.moduleSpecifier as StringLiteral);
  }

  get path(): string {
    return this.literal.text;
  }

  protected update(value: string): void {
    this.literal.text = value;
  }
}
