
import TspmError from '@lib/Error';
import Path from '@lib/Path';

export interface IOptions {
  path: Path;
}

export default class ResolutionError extends TspmError {
  readonly path: Path;

  constructor({ path }: IOptions) {
    super(`File not found: '${path}'`);
    this.path = path;
  }
}
