import { ExportAllDeclaration, ExportNamedDeclaration,  ImportDeclaration, SimpleLiteral } from 'estree';

import isExportNamedDeclaration from '@es/isExportNamedDeclaration';
import isImportDeclaration from '@es/isImportDeclaration';
import isRequireCallExpression from '@es/isRequireCallExpression';
import isSimpleLiteral from '@es/isSimpleLiteral';
import RequireCallExpression from '@es/RequireCallExpression';
import { File } from '@lib/convert';

import Base, { IDerivedOptions as IBaseOptions } from '@lib/Declaration';

export type Interface = (ExportAllDeclaration | ExportNamedDeclaration) | ImportDeclaration | RequireCallExpression;

export type IOptions<T extends Interface> = IBaseOptions<T>;

function getLiteral(declaration: Interface, file: File): SimpleLiteral {
  const literal =
    isExportNamedDeclaration(declaration) ? declaration.source :
    isImportDeclaration(declaration) ? declaration.source :
    isRequireCallExpression(declaration) ? declaration.arguments[0] :
    undefined;
  if (literal === undefined) {
    throw new TypeError(`Failed to find ES declaration in '${file.source}'`);
  } else if (!isSimpleLiteral(literal)) {
    const type = literal ? literal.type : 'unknown';
    throw new TypeError(`Invalid ES declaration source type '${type}' in '${file.source}'`);
  }
  return literal;
}

export default class Declaration<T extends Interface> extends Base<T> {
  constructor({ declaration, file, ...rest}: IOptions<T>) {
    // RAII checks
    const literal = getLiteral(declaration, file);
    if (typeof literal.value !== 'string') {
      throw new TypeError(`The type '${typeof literal.value}' of the ES source must be 'string' for '${file.source}'`);
    }

    super({declaration, file, ...rest, path: literal.value});
  }

  private get literal(): SimpleLiteral {
    return getLiteral(this.declaration, this.file);
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
