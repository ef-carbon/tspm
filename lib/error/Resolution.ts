// tslint:disable-next-line:no-implicit-dependencies
import Declaration from '@lib/Declaration';
import TspmError from '@lib/Error';
import Path from '@lib/Path';
import { ExportAllDeclaration,  ExportNamedDeclaration, ImportDeclaration } from 'estree';

export interface IOptions {
  path: string;
  module: Path;
  declaration: Declaration<(ExportAllDeclaration | ExportNamedDeclaration) | ImportDeclaration>;
}

export default class ResolutionError extends TspmError {
  readonly path: string;
  readonly module: Path;
  readonly declaration: Declaration<(ExportAllDeclaration | ExportNamedDeclaration) | ImportDeclaration>;

  constructor({ path, module, declaration }: IOptions) {
    super(`Failed to resolve '${path}' in '${module}'`);
    this.path = path;
    this.module = module;
    this.declaration = declaration;
  }
}
