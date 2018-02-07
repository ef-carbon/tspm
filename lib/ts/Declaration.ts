import { ExportDeclaration,  ImportDeclaration, StringLiteral, SyntaxKind } from 'typescript';

import Base, { IDerivedOptions as IBaseOptions } from '@lib/Declaration';

export type Interface = ExportDeclaration | ImportDeclaration;

export type IOptions<T extends Interface> = IBaseOptions<T>;

export default class Declaration<T extends Interface> extends Base<T> {
  constructor({ declaration, ...rest}: IOptions<T>) {

    // RAII checks
    const { kind, text } = (declaration.moduleSpecifier as StringLiteral);
    if (kind !== SyntaxKind.StringLiteral) {
      throw new TypeError(`Invalid TS declaration source type: ${kind}`);
    }

    super({declaration, ...rest, path: text});
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
