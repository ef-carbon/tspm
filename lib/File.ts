import { existsSync as fileExistsSync, PathLike } from 'fs';
import { CompilerOptions as ICompilerOptions, ParsedCommandLine as ICompilerConfig } from 'typescript';

import FileNotFoundError from '@error/FileNotFound';
import { Declaration } from '@lib/convert';
import Path from '@lib/Path';

export interface IDerivedOptions {
  path: string | Path;
  options: ICompilerOptions;
  config: ICompilerConfig;
}

export interface IOptions extends IDerivedOptions {
  extension: string;
}

function commonPathPrefix(paths: IterableIterator<string>): string {
  const { done, value: left } = paths.next();
  if (done) {
    return '';
  }
  let index = left.length;
  for (const right of paths) {
    for (let i = 0; i < index; ++i) {
      if (left.charAt(i) !== right.charAt(i)) {
        index = i;
        break;
      }
    }
  }
  return left.substring(0, index);
}

export default abstract class File<I extends Declaration, E extends Declaration> {
  readonly source: Path;
  protected readonly root: Path;
  protected readonly options: ICompilerOptions;
  protected readonly extension: string;

  constructor({ path, options, config: { fileNames }, extension }: IOptions) {
    this.source = new Path(path.toString());
    this.root = new Path(commonPathPrefix(fileNames[Symbol.iterator]()));
    this.options = options;
    this.extension = extension;
    if (!fileExistsSync(this.destination.toString())) {
      throw new FileNotFoundError({path: this.destination});
    }
  }

  get isMapped(): Promise<boolean> {
    return (async () => {
      let mapped = false;
      for await (const imprt of this.imports()) {
        mapped = mapped || await imprt.isMapped;
      }
      for await (const imprt of this.exports()) {
        mapped = mapped || await imprt.isMapped;
      }
      return mapped;
    })();
  }

  abstract imports(): AsyncIterableIterator<I>;

  abstract exports(): AsyncIterableIterator<E>;

  get destination(): Path {
    const { outDir } = this.options;

    if (!outDir) {
      throw new TypeError(`Only 'outDir' is supported`);
    }

    const out = new Path(outDir);
    const destination = out.join(this.source.relative(this.root));
    destination.extension = this.extension;
    return destination;
  }

  abstract write(path?: PathLike | number, options?: {
    encoding?: string | null;
    mode?: number | string;
    flag?: string;
  } | string | null): Promise<void>;

  async *map(options: ICompilerOptions): AsyncIterableIterator<I | E> {
    for await (const imprt of this.imports()) {
      const mapped = await imprt.map(options);
      if (mapped) {
        yield imprt;
      }
    }
    for await (const exprt of this.exports()) {
      const mapped = await exprt.map(options);
      if (mapped) {
        yield exprt;
      }
    }
  }

  toString(): string {
    return this.destination.toString();
  }
}
