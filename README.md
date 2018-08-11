# flow-reporter-codeframe [![npm version][npmv-img]][npmv-url] [![github release][ghrelease-img]][ghrelease-url] [![License][license-img]][license-url]

> [@FlowType](https://flow.org) errors reporter similiar to ESLint's codeframe one

<div id="thetop"></div>

[![Code style][codestyle-img]][codestyle-url]
[![CircleCI linux build][linuxbuild-img]][linuxbuild-url]
[![CodeCov coverage status][codecoverage-img]][codecoverage-url]
[![DavidDM dependency status][dependencies-img]][dependencies-url]
[![Renovate App Status][renovateapp-img]][renovateapp-url]
[![Make A Pull Request][prs-welcome-img]][prs-welcome-url]
[![Semantically Released][new-release-img]][new-release-url]

If you have any _how-to_ kind of questions, please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping [@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

[![Conventional Commits][ccommits-img]][ccommits-url]
[![Become a Patron][patreon-img]][patreon-url]
[![Share Love Tweet][shareb]][shareu]
[![NPM Downloads Weekly][downloads-weekly-img]][npmv-url]
[![NPM Downloads Monthly][downloads-monthly-img]][npmv-url]
[![NPM Downloads Total][downloads-total-img]][npmv-url]

Project is [semantically](https://semver.org) & automatically released on [CircleCI][codecoverage-url] with [new-release][] and its [New Release](https://github.com/apps/new-release) GitHub App.

<p align="center">
  <a href="https://github.com/olstenlarck/flow-reporter-codeframe">
    <img src="./media/demo.png" width="75%">
  </a>
</p>

## Table of Contents
- [Install](#install)
- [CLI](#cli)
- [API](#api)
  * [src/index.js](#srcindexjs)
- [Contributing](#contributing)
- [Contributors](#contributors)
- [License](#license)

## Install
This project requires [**Node.js**](https://nodejs.org) **>=6.0.0**. Install it using [**yarn**](https://yarnpkg.com) or [**npm**](https://npmjs.com).  
_We highly recommend to use Yarn when you think to contribute to this project._

```bash
$ yarn add flow-reporter-codeframe
```

## CLI
Use `flow check` or `flow focus-check filename.js` and the json formatter.

```
# general use
flow check --json --json-version 2 | flow-reporter-codeframe

# or
cat report-file.txt | flow-reporter-codeframe

# or generate report file
flow check --json --json-version 2 > flow-report.json

# and pass that file to the reporter
flow-reporter-codeframe flow-report.json
```

Optionally pass `--no-color` to disable colors - make note that we detect if it is
run on CI with [is-ci][], so they are disabled there by default.

Optionally, we can highlight the code, pass `--highlight-code` if you want to be more fancy. :)
If `--no-color` is passed, that's disabled automagically too.

## API
_Generated using [docks](http://npm.im/docks)._
### [src/index.js](/src/index.js)

#### [flowReporter](/src/index.js#L47)
Formatting the `val` to look like ESLint's cool `codeframe` reporter.
It may be a bit more verbose and to have a bit more lines of code than
the Flow's default one, but that's not a bad thing.

You should provide valid report, which means that for now you are forced to
use `--json --json-version 2` flags if you want to use that reporter.

<p align="center">
  <img src="./media/api-usage.svg">
</p>

**Params**
- `val` **{string|object}** the Flow's JSON version 2 thingy, `--json` + `--json-version 2`
- `opts` **{object}** optional options `color` and `highlightCode`

**Returns**
- `Promise` resolves to a `string` if there is errors, `undefined` if no errors

**Examples**
```javascript
import execa from 'execa';
import reporter, { getDefaultOptions } from 'flow-reporter-codeframe';

async function main() {
  try {
    await execa('flow', ['check', '--json', '--json-version', '2']);
  } catch (err) {
    const output = await reporter(err.stdout, getDefaultOptions());
    console.log(output);
  }
}

main();
```

#### [.getDefaultOptions](/src/index.js#L220)
Get default options for the reporter. By default,
we have colors turned on, and highlighting code turned off.

**Returns**
- `object` containing `{ color: boolean, highlightCode: boolean }`

**Examples**
```javascript
import { getDefaultOptions } from 'flow-reporter-codeframe';

console.log(getDefaultOptions());
// => { color: true, highlightCode: false }
```

**[back to top](#thetop)**

## Contributing
Please read the [Contributing Guide](./CONTRIBUTING.md) and [Code of Conduct](./CODE_OF_CONDUCT.md) documents for advices.  
For bugs reports and feature requests, [please create an issue][open-issue-url] or ping [@tunnckoCore](https://twitter.com/tunnckoCore) at Twitter.

## Contributors
Thanks to the hard work of these wonderful people this project is alive and it also follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification.  
[Pull requests](https://github.com/tunnckoCore/contributing#opening-a-pull-request), stars and all kind of [contributions](https://opensource.guide/how-to-contribute/#what-it-means-to-contribute) are always welcome. :sparkles: 

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

## License
Copyright (c) 2018-present, [Charlike Mike Reagent][author-link] `<olsten.larck@gmail.com>`.  
Released under the [Apache-2.0 License][license-url].

---

_This file was generated by [verb-generate-readme](https://github.com/verbose/verb-generate-readme), v0.8.0, on August 11, 2018._

<!-- Heading badges -->
[npmv-url]: https://www.npmjs.com/package/flow-reporter-codeframe
[npmv-img]: https://badgen.net/npm/v/flow-reporter-codeframe?icon=npm

[ghrelease-url]: https://github.com/olstenlarck/flow-reporter-codeframe/releases/latest
[ghrelease-img]: https://badgen.net/github/release/olstenlarck/flow-reporter-codeframe?icon=github

[license-url]: https://github.com/olstenlarck/flow-reporter-codeframe/blob/master/LICENSE
[license-img]: https://badgen.net/npm/license/flow-reporter-codeframe

<!-- Front line badges -->

[codestyle-url]: https://github.com/olstenlarck/eslint-config-esmc
[codestyle-img]: https://badgen.net/badge/code%20style/airbnb/ff5a5f?icon=airbnb

[linuxbuild-url]: https://circleci.com/gh/olstenlarck/flow-reporter-codeframe/tree/master
[linuxbuild-img]: https://badgen.net/circleci/github/olstenlarck/flow-reporter-codeframe/master?label=build&icon=circleci

[codecoverage-url]: https://codecov.io/gh/olstenlarck/flow-reporter-codeframe
[codecoverage-img]: https://badgen.net/codecov/c/github/olstenlarck/flow-reporter-codeframe?icon=codecov

[dependencies-url]: https://david-dm.org/olstenlarck/flow-reporter-codeframe
[dependencies-img]: https://badgen.net/david/dep/olstenlarck/flow-reporter-codeframe?label=deps

[ccommits-url]: https://conventionalcommits.org/
[ccommits-img]: https://badgen.net/badge/conventional%20commits/v1.0.0/dfb317

[new-release-url]: https://github.com/tunnckoCore/new-release
[new-release-img]: https://badgen.net/badge/semantically/released/05c5ff

[downloads-weekly-img]: https://badgen.net/npm/dw/flow-reporter-codeframe
[downloads-monthly-img]: https://badgen.net/npm/dm/flow-reporter-codeframe
[downloads-total-img]: https://badgen.net/npm/dt/flow-reporter-codeframe

[renovateapp-url]: https://renovatebot.com
[renovateapp-img]: https://badgen.net/badge/renovate/enabled/green

[prs-welcome-img]: https://badgen.net/badge/PRs/welcome/green
[prs-welcome-url]: http://makeapullrequest.com

[paypal-donate-url]: https://paypal.me/tunnckoCore/10
[paypal-donate-img]: https://badgen.net/badge/$/support/purple

[patreon-url]: https://www.patreon.com/bePatron?u=5579781
[patreon-img]: https://badgen.net/badge/become/a%20patron/F96854?icon=patreon

[shareu]: https://twitter.com/intent/tweet?text=https://github.com/olstenlarck/flow-reporter-codeframe&via=tunnckoCore
[shareb]: https://badgen.net/badge/twitter/share/1da1f2?icon=twitter
[open-issue-url]: https://github.com/olstenlarck/flow-reporter-codeframe/issues/new
[author-link]: https://tunnckocore.com

[is-ci]: https://github.com/watson/is-ci
[new-release]: https://github.com/tunnckoCore/new-release