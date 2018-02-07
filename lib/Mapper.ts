import EsExport from '@es/Export';
import EsFile from '@es/File';
import EsImport from '@es/Import';
import TsExport from '@ts/Export';
import TsFile from '@ts/File';
import TsImport from '@ts/Import';
import { existsSync as fileExistsSync, readFileSync as fileReadSync } from 'fs';
import { dirname, resolve } from 'path';
import * as ts from 'typescript';

export interface IOptions {
  tsconfig: string;
  projectRoot?: string;
}

export default class Mapper {
  private readonly parsed: ts.ParsedCommandLine;

  constructor({ tsconfig, projectRoot }: IOptions) {
    const config = ts.readConfigFile(tsconfig, path => fileReadSync(path, 'utf-8'));
    if (config.error) {
      throw new TypeError(ts.formatDiagnostics([config.error], {
        getCanonicalFileName: f => f,
        getCurrentDirectory: process.cwd,
        getNewLine: () => '\n',
      }));
    }

    const host: ts.ParseConfigHost = {
      fileExists: fileExistsSync,
      readDirectory: ts.sys.readDirectory,
      readFile: f => fileReadSync(f, 'utf8'),
      useCaseSensitiveFileNames: true,
    };

    const root = resolve(projectRoot || dirname(tsconfig));

    const parsed = ts.parseJsonConfigFileContent(config.config, host, root, {noEmit: true});

    // ignore warnings and 'TS18003: No inputs were found in config file ...'
    const errors = parsed.errors.filter(d => d.category === ts.DiagnosticCategory.Error && d.code !== 18003);
    if (errors.length !== 0) {
      throw new TypeError(ts.formatDiagnostics(errors, {
        getCanonicalFileName: f => f,
        getCurrentDirectory: process.cwd,
        getNewLine: () => '\n',
      }));
    }

    parsed.options.rootDir = parsed.options.rootDir || projectRoot;
    this.parsed = parsed;
  }

  async *files(): AsyncIterableIterator<EsFile | TsFile> {
    const { options } = this.parsed;
    yield* this.parsed.fileNames.map(path => new EsFile({ path, options, config: this.parsed }));
    if (options.declaration) {
      yield* this.parsed.fileNames.map(path => new TsFile({ path, options, config: this.parsed }));
    }
  }

  async *map(): AsyncIterableIterator<EsImport | EsExport | TsImport | TsExport> {
    for await (const file of this.files()) {
      yield* file.map(this.parsed.options);
    }
  }
}
