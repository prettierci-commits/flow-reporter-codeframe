/**
 * @copyright 2018-present, Charlike Mike Reagent (https://tunnckocore.com)
 * @license Apache-2.0
 */

import path from 'path';
import proc from 'process';
import isCI from 'is-ci';
import fs from 'fs-extra';
import ansi from 'ansi-colors';
import isColors from 'supports-color';
import { codeFrameColumns } from '@babel/code-frame';

const stripColor = ansi.stripColor || ansi.unstyle;

/**
 * Formatting the `val` to look like ESLint's cool `codeframe` reporter.
 * It may be a bit more verbose and to have a bit more lines of code than
 * the Flow's default one, but that's not a bad thing.
 *
 * You should provide valid report, which means that for now you are forced to
 * use `--json --json-version 2` flags if you want to use that reporter.
 *
 * @example
 * import execa from 'execa';
 * import reporter from 'flow-reporter-codeframe';
 *
 * async function main() {
 *   try {
 *     await execa('flow', ['check', '--json', '--json-version', '2']);
 *   } catch (err) {
 *     const output = await reporter(err.stdout);
 *     console.log(output);
 *   }
 * }
 *
 * main();
 *
 * @name flowReporter
 * @param {string|object} val the Flow's JSON version 2 thingy, `--json` + `--json-version 2`
 * @param {object} opts optional options `color` and `highlightCode`
 * @returns {Promise} resolves to a `string` if there is errors, `undefined` if no errors
 * @public
 */
export default async function flowReporter(val, opts) {
  const options = Object.assign(getDefaultOptions(), opts);
  ansi.enabled = options.color;

  return new Promise(async (resolve) => {
    let result = null;

    if (val && typeof val === 'object') {
      result = val;
    } else if (val && typeof val === 'string') {
      result = JSON.parse(val);
    }

    if (result.passed) {
      resolve();
      return;
    }

    const output = result.errors
      .map(normalize)
      .map(normalizeRefs('primary'))
      .map(normalizeRefs('root'))
      .map(getContents)
      .map((x) => createFrame(x, options))
      .reduce(outputError, []);

    output.unshift('');
    output.push(ansi.bold.red(`${result.errors.length} errors found.`));

    resolve(output.join('\n'));
  });
}

function normalize({ primaryLoc, referenceLocs, messageMarkup }) {
  const message = messageMarkup
    .reduce((acc, item) => {
      if (item.kind === 'Text') {
        return acc.concat(item.text);
      }
      if (item.kind === 'Code') {
        return acc.concat(ansi.bold(item.text));
      }
      if (item.kind === 'Reference') {
        const type = item.message[0].text;
        return acc.concat(ansi.underline(type), ' ', `[${item.referenceId}]`);
      }

      return acc;
    }, [])
    .join('')
    .replace('[1]', ansi.bold.blue('[1]'))
    .replace('[2]', ansi.bold.red('[2]'));

  return { message, primary: primaryLoc, root: referenceLocs['2'] };
}

function normalizeRefs(type) {
  return (res) => {
    if (type === 'root' && !res.root) {
      return res;
    }

    const refStart = res[type].start;
    const refEnd = res[type].end;

    const ref = {
      cwd: proc.cwd(),
      absolutePath: res[type].source,
      loc: {
        start: { line: refStart.line, column: refStart.column },
        end: { line: refEnd.line, column: refEnd.column + 1 },
      },
      id: type === 'primary' ? '[1]' : '[2]',
    };

    /* istanbul ignore if */
    if (isCI) {
      // various shitty tweaks for CI environment
      const basename = path.basename(ref.cwd);

      const index = ref.absolutePath.indexOf(basename);
      const filepath = ref.absolutePath.slice(index + basename.length + 1);
      ref.absolutePath = path.join(ref.cwd, filepath);
    }

    ref.relativePath = path.relative(ref.cwd, ref.absolutePath);

    const { start } = ref.loc;
    ref.shownPath = `${ref.relativePath}:${start.line}:${start.column}`;

    res[type] = ref;
    return res;
  };
}

function getPath(x) {
  /* istanbul ignore if */
  if (isCI === true) {
    return path.resolve(proc.cwd(), x.relativePath);
  }
  return x.absolutePath;
}

function getContents({ primary, root, message }) {
  /* eslint-disable no-param-reassign */
  primary.content = fs.readFileSync(getPath(primary), 'utf8');

  if (root) {
    root.content = fs.readFileSync(getPath(root), 'utf8');
  }

  /* eslint-enable no-param-reassign */

  return { primary, root, message };
}

function colorFixer(line) {
  const cleanLine = stripColor(line);
  const replacer = (x) => (m, part) => ansi[x].bold(stripColor(part));

  if (cleanLine.trim().startsWith('|')) {
    if (cleanLine.includes('[1]')) {
      return line.replace(/(\^.+)/g, replacer('blue'));
    }
    if (cleanLine.includes('[2]')) {
      return line.replace(/(\^.+)/g, replacer('red'));
    }
  }
  return line;
}

function createFrame({ primary, root, message }, { color, highlightCode }) {
  /* eslint-disable no-param-reassign */
  primary.frame = codeFrameColumns(primary.content, primary.loc, {
    highlightCode: color && highlightCode,
    message: ansi.blue(primary.id),
  })
    .split('\n')
    .map(colorFixer)
    .join('\n');

  if (root) {
    root.frame = codeFrameColumns(root.content, root.loc, {
      highlightCode: color && highlightCode,
      message: ansi.red(root.id),
    })
      .split('\n')
      .map(colorFixer)
      .join('\n');
  }

  /* eslint-enable no-param-reassign */

  return { primary, root, message };
}

function outputError(acc, { primary, root, message }) {
  acc.push(
    [
      `${ansi.red('error')}: ${ansi.bold('some type failures found')}`,
      ansi.dim('(null)'),
      'at',
      `${ansi.green(primary.shownPath)}:`,
    ].join(' '),
  );

  acc.push(message);
  acc.push('');
  acc.push(ansi.blue(primary.shownPath));
  acc.push(primary.frame);
  if (root) {
    acc.push('');
    acc.push(ansi.red(root.shownPath));
    acc.push(root.frame);
  }
  acc.push('');

  return acc;
}

/**
 * Get default options for the reporter. By default,
 * we have colors turned on, and highlighting code turned off.
 *
 * @example
 * import { getDefaultOptions } from 'flow-reporter-codeframe';
 *
 * console.log(getDefaultOptions());
 * // => { color: true, highlightCode: false }
 *
 * @name .getDefaultOptions
 * @returns {object} containing `{ color: boolean, highlightCode: boolean }`
 * @public
 */
export function getDefaultOptions() {
  return {
    color: isCI === true ? false : isColors.stdout.level,
    highlightCode: false,
  };
}

flowReporter.getDefaultOptions = getDefaultOptions;
