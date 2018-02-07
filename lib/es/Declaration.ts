import { ExportAllDeclaration, ExportNamedDeclaration,  ImportDeclaration, SimpleLiteral } from 'estree';

import Base, { IDerivedOptions as IBaseOptions } from '@lib/Declaration';

export type Interface = (ExportAllDeclaration | ExportNamedDeclaration) | ImportDeclaration;

export type IOptions<T extends Interface> = IBaseOptions<T>;

export default class Declaration<T extends Interface> extends Base<T> {
  constructor({ declaration, file, ...rest}: IOptions<T>) {
    // RAII checks
    const { type, value } = (declaration.source as SimpleLiteral);
    if (type !== 'Literal') {
      throw new TypeError(`Invalid ES declaration source type '${type}' in '${file.source}'`);
    }
    if (typeof value !== 'string') {
      throw new TypeError(`The type '${typeof value}' of the ES source value was not a 'string' for '${file.source}'`);
    }

    super({declaration, file, ...rest, path: value});
  }

  private get literal(): SimpleLiteral {
    return (this.declaration.source as SimpleLiteral);
  }

  get path(): string {
    return this.literal.value as string;
  }

  protected update(value: string): void {
    if (this.literal.raw) {
      this.literal.raw = this.literal.raw.replace(this.path, value);
    }
    this.literal.value = value;
  }
}
