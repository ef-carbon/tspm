import Export from '@lib/Export';
import File from '@lib/File';
import Import from '@lib/Import';
import * as fs from 'fs';
import { dirname, resolve } from 'path';
import * as ts from 'typescript';

export interface IOptions {
  tsconfig: string;
  projectRoot?: string;
}

export default class Mapper {
  private readonly parsed: ts.ParsedCommandLine;

  constructor({ tsconfig, projectRoot }: IOptions) {
    const config = ts.readConfigFile(tsconfig, path => fs.readFileSync(path, 'utf-8'));
    if (config.error) {
      throw new TypeError(ts.formatDiagnostics([config.error], {
        getCanonicalFileName: f => f,
        getCurrentDirectory: process.cwd,
        getNewLine: () => '\n',
      }));
    }

    const parseConfig: ts.ParseConfigHost = {
      fileExists: fs.existsSync,
      readDirectory: ts.sys.readDirectory,
      readFile: file => fs.readFileSync(file, 'utf8'),
      useCaseSensitiveFileNames: true,
    };

    const root = resolve(projectRoot || dirname(tsconfig));

    const parsed = ts.parseJsonConfigFileContent(config.config, parseConfig, root, {noEmit: true});

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

  async *files(): AsyncIterableIterator<File> {
    const { options } = this.parsed;
    yield* this.parsed.fileNames.map(path => new File({ path, options, config: this.parsed }));
  }

  async *map(): AsyncIterableIterator<Import | Export> {
    for await (const file of this.files()) {
      yield* file.map(this.parsed.options);
    }
  }
}
