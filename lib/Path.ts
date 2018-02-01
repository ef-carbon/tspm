import { basename, dirname, extname, join, relative, resolve } from 'path';

export default class Path {
  private absolute: string;

  constructor(path: string) {
    this.absolute = resolve(path);
  }

  get path(): string {
    return this.absolute;
  }

  get name(): string {
    return basename(this.absolute);
  }

  get directory(): Path {
    return new Path(dirname(this.absolute));
  }

  get parent(): Path {
    return this.directory;
  }

  get extension(): string {
    return extname(this.absolute);
  }

  set extension(value: string) {
    if (!value.startsWith('.')) {
      throw Error(`Extension must start with a '.': ${value}`);
    }
    this.absolute = join(this.directory.toString(), `${basename(this.absolute, this.extension)}${value}`);
  }

  relative(base?: string | Path): string {
    return relative((base || process.cwd).toString(), this.absolute);
  }

  join(path: string): Path {
    return new Path(join(this.absolute, path));
  }

  toString(): string {
    return this.absolute;
  }
}
