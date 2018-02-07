import { DeclarationInterface as Interface } from '@lib/convert';
import Declaration from '@lib/Declaration';
import TspmError from '@lib/Error';
import Path from '@lib/Path';

export interface IOptions {
  path: string;
  module: Path;
  declaration: Declaration<Interface>;
}

export default class ResolutionError extends TspmError {
  readonly path: string;
  readonly module: Path;
  readonly declaration: Declaration<Interface>;

  constructor({ path, module, declaration }: IOptions) {
    super(`Failed to resolve '${path}' in '${module}'`);
    this.path = path;
    this.module = module;
    this.declaration = declaration;
  }
}
