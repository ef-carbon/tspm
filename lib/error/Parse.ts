import { File } from '@lib/convert';
import TspmError from '@lib/Error';

export interface IOptions {
  file: File;
  data: string;
  error: Error;
  range?: number;
  regex?: RegExp;
}

const regex = /(.+) \(([0-9]+):([0-9]+)\)/;

export default class ParseError extends TspmError {
  readonly file: File;
  readonly data: string;
  readonly error: string;
  readonly line: number;
  readonly column: number;
  readonly before: string;
  readonly target: string;
  readonly after: string;

  constructor({ file, data, error, range, regex: re }: IOptions) {
    const buffer = range || 5;
    let { message } = error;
    let line = 0;
    let column = 0;
    let before = '<';
    let target = 'unknown';
    let after = '>';

    // Attempt to parse syntax error locations
    const matches = (re || regex).exec(message);
    if (matches) {
      message = matches[1];
      line = parseInt(matches[2], 10);
      column = parseInt(matches[3], 10);
      if (!(isNaN(line) || isNaN(column))) {
        const slice = data.split(/\r?\n/)[line - 1];
        before = slice.substring(column - buffer, column);
        target = slice.charAt(column);
        after = slice.substring(column + 1, column + 1 + buffer);
      }
    }

    super(`${message} (${file.destination}:${line}:${column}): '${before}⇝${target}⇜${after}'`);
    this.file = file;
    this.data = data;
    this.error = message;
    this.line = line;
    this.column = column;
    this.before = before;
    this.target = target;
    this.after = after;
  }
}
