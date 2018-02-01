import * as fs from 'fs';
import * as process from 'process';
import * as yargs from 'yargs';

import convert from '@lib/convert';
import TspmError from '@lib/Error';
import ParseError from '@lib/error/Parse';

interface IColours {
  [name: string]: string;
}

const colourful: IColours = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  black: '\x1b[30m',
  reset: '\x1b[0m',
};

const colourLess = Object.keys(colourful).reduce<IColours>((o, k) => {o[k] = ''; return o; }, {});

const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../../package.json`, 'utf-8'));
const { bugs } = packageJson;

export interface IOptions {
  tsconfig: string;
  projectRoot: string;
  colour: true | 'auto' | false;
  verbose: false;
  silent: false;
}

export async function parseArguments(args: ReadonlyArray<string>): Promise<IOptions> {
  const parser = yargs
    .usage('Usage: ef-tspm')
    .option('verbose', {
      alias: 'v',
      default: false,
      description: 'Logs more information to the console',
    })
    .option('silent', {
      alias: 's',
      default: false,
      description: 'Logs no information but errors to the console',
    })
    .option('tsconfig', {
      alias: 'c',
      default: `${process.cwd()}/tsconfig.json`,
      description: 'Determines the TypeScript configuration to read',
    })
    .option('projectRoot', {
      alias: 'r',
      default: process.cwd(),
      description: 'The location of the TypeScript project root',
    })
    .option('colour', {
      choices: ['yes', 'auto', 'no'],
      default: 'auto',
      description: 'Enables colour in the console output',
    })
    .example('$0 -c ./tsconfig.json', 'Performs mapping of the files specified in the TypeScript configuration')
    .epilogue('Performs mapping of the TypeScript module lookups to the correct paths. The executable uses the ' +
      'TypeScript configuration to determine the input and output files. It then parses the output files and ' +
      'updates any path mapping to the correct relative path');

  const { tsconfig, projectRoot, silent, verbose, colour } = parser.parse(args.slice());

  const options: IOptions = {
    tsconfig,
    projectRoot,
    colour: (colour === 'yes') ? true : (colour === 'no') ? false : colour,
    verbose,
    silent,
  };
  return options;
}

function colours(colour: true | 'auto' | false, stream: NodeJS.WriteStream): IColours {
  return (colour === true || (colour === 'auto' && stream.isTTY)) ? colourful : colourLess;
}

export async function map(options: IOptions): Promise<number> {
  const { projectRoot: root, colour, silent } = options;

  try {
    const {blue: r, yellow: p, green: t, reset: _} = colours(colour, process.stderr);
    for await (const mapped of convert(options)) {
      if (!silent) {
        const { original, path, module } = mapped;
        const relative = module.relative(root);
        process.stdout.write(`${t}Mapped${_} '${r}${relative}${_}': '${p}${original}${_}' → '${p}${path}${_}'\n`);
      }
    }
    return 0;
  } catch (error) {
    const {red: r, yellow: y, blue: b, green: g, reset: _} = colours(colour, process.stderr);

    if (error instanceof ParseError) {
      const { error: msg, file: { destination: path }, before: pre, target: token, after: post, column, line} = error;
      const formatted = `${r}JavaScript parsing error${_}: ` +
        `${y}${msg}${_} (${g}${path}${_}:${y}${line}${_}:${y}${column}${_}): '${pre}${y}${token}${_}${post}'`;
      process.stderr.write(`${formatted}\n`);
      return 3;
    } else if (error instanceof TspmError) {
      process.stderr.write(`${error.message}\n`);
      return 2;
    }

    // General error, print full stack, in colour
    let {stack} = error;

    // (<filename>:<start>:<end>)
    stack = stack.replace(/ \((.+):([0-9]+):([0-9]+)\)/g, ` (${g}$1${_}:${y}$2${_}:${y}$3${_})`);

      // at <Error>: <message>
    stack = stack.replace(/^([^:]+?):([^()]+)/g, `${r}$1${_}:${y}$2${_}`);

    // at <filename>
    stack = stack.replace(/(at +)(.+)( +\()/g, `$1${b}$2${_}$3`);

    // at <filename>:<start>:<end>
    stack = stack.replace(/(at +)(.+):([0-9]+):([0-9]+)/g, `$1${g}$1${_}:${y}$2${_}:${y}$3${_}`);

    // (<anonymous>)
    stack = stack.replace(/\(<anonymous>\)/g, `(${g}<anonymous>${_})`);

    process.stderr.write(
`${stack}

${r}Fatal Error Encountered${_}: ${y}Please report this to '${_}${bugs}${y}'${_}
`);

    return 5;
  }
}

export default async function main(args: ReadonlyArray<string>): Promise<number> {
  return map(await parseArguments(args));
}
