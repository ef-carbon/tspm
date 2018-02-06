// tslint:disable-next-line:no-implicit-dependencies
import { ExportAllDeclaration, ExportNamedDeclaration,  ImportDeclaration, SimpleLiteral } from 'estree';
import * as fs from 'fs';
import { basename, dirname, join, relative } from 'path';
import * as ts from 'typescript';

import ResolutionError from '@lib/error/Resolution';
import File from '@lib/File';
import Path from '@lib/Path';

export interface IOptions<T> {
  declaration: T;
  file: File;
}

function isBuiltinModule(module: string): boolean {
  // TODO: change to use 'is-builtin-module', need to submit @types/is-builtin-module
  const builtin = [
    'assert',
    'async_hooks',
    'buffer',
    'child_process',
    'cluster',
    'console',
    'constants',
    'crypto',
    'dgram',
    'dns',
    'domain',
    'events',
    'fs',
    'http',
    'http2',
    'https',
    'inspector',
    'module',
    'net',
    'os',
    'path',
    'perf_hooks',
    'process',
    'punycode',
    'querystring',
    'readline',
    'repl',
    'stream',
    'string_decoder',
    'timers',
    'tls',
    'tty',
    'url',
    'util',
    'v8',
    'vm',
    'zlib',
  ];
  return builtin.indexOf(module) !== -1;
}

export type Base = (ExportAllDeclaration | ExportNamedDeclaration) | ImportDeclaration;

export default abstract class Export<T extends Base> {
  protected readonly declaration: T;
  readonly file: File;
  private processed: boolean = false;
  readonly original: string;

  constructor(options: IOptions<T>) {
    this.declaration = options.declaration;
    this.file = options.file;

    // RAII checks
    const { type, value } = this.literal;
    if (type !== 'Literal') {
      throw new TypeError(`Invalid export declaration source type: ${type}`);
    }
    if (typeof value !== 'string') {
      throw new TypeError(`The type of the export source value was not a 'string': ${typeof value}`);
    }

    this.original = this.path;
  }

  get isMapped(): Promise<boolean> {
    return Promise.resolve(this.processed);
  }

  get module(): Path {
    return this.file.destination;
  }

  get literal(): SimpleLiteral {
    return (this.declaration.source as SimpleLiteral);
  }

  get path(): string {
    return this.literal.value as string;
  }

  private update(value: string): void {
    if (this.literal.raw) {
      this.literal.raw = this.literal.raw.replace(this.path, value);
    }
    this.literal.value = value;
  }

  toString(): string {
    return `${this.module}: ${this.path}`;
  }

  async map(options: ts.CompilerOptions): Promise<boolean> {
    if (this.processed) {
      return true;
    }

    // TODO: add a global cache here
    const { resolvedModule: resolved } = ts.nodeModuleNameResolver(this.path, this.file.source.toString(), options, {
      fileExists: fs.existsSync,
      readFile: (f: string) => fs.readFileSync(f, 'utf8'),
    });

    this.processed = true;

    if (isBuiltinModule(this.path)) {
      return false;
    } else if (!resolved) {
      throw new ResolutionError({declaration: this, module: this.file.source, path: this.path});
    }

    const { resolvedFileName: pathWithExtension, extension, isExternalLibraryImport: external } = resolved;
    const path = join(dirname(pathWithExtension), basename(pathWithExtension, extension));
    let resolution = relative(this.file.source.parent.toString(), path);
    if (!resolution.startsWith('.')) {
      resolution = `./${resolution}`;
    }
    if (!external && (this.path !== resolution)) {
      this.update(resolution);
      return true;
    }

    return false;
  }
}
