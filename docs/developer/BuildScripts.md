# Build Scripts

Various build/development tasks are handled by [running scripts through npm](https://docs.npmjs.com/cli/run-script). To execute a script, use the command:

```
npm run <script-name> [-- <args>...]
```

Some scripts (e.g. `test`, `start`) are part of [npm's standard lifecycle](https://docs.npmjs.com/misc/scripts). For those, `run` may be omitted from the command.

Scripts are defined in the top-level [package.json](../../package.json) file. To see the available scripts, examine the `scripts` property there, or use `npm run` with no script name.

## Script Reference

The following scripts are used in cspace-ui development.

### build

```
npm run build
```

The `build` script compiles and bundles the source code. Outputs include:

* Cross-browser/Node.js compatible code, in `lib`. The project's source code is written using the latest version of JavaScript, and may use proposed language features that have not yet been standardized. For compatibility across browsers and Node.js, it is compiled to the lowest common denominator compatible with all of the supported browsers and versions of Node.js. The `lib` directory contains this compiled output. Its structure mirrors `src`, where each source file has a corresponding compiled lib file. These files are Node.js-compatible [CommonJS](http://www.commonjs.org/) modules, suitable for `require`-ing into Node.js programs.
* Distribution bundles, in `dist`. A distribution bundle contains the entire cspace-ui application, including code, JavaScript dependencies, markup, images, and stylesheets, rolled up into a single JavaScript file. Two bundles are generated: a development bundle (cspaceUI.js), and a production bundle (cspaceUI.min.js). The production bundle differs from the development bundle in that it does not contain source maps, certain development-only code has been removed, and the code has been minified. The bundles are [UMD](http://davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/) modules, so exported data can be accessed through [CommonJS](http://www.commonjs.org/) and [AMD](https://en.wikipedia.org/wiki/Asynchronous_module_definition) module loaders, or through global variables in the browser.
* Extracted message bundles, in `build/messages`. In cspace-ui source code, translatable messages are defined in the source files where they are used, rather than in a centralized location. This is convenient for developers, but inconvenient for translators. The `build` script extracts message definitions from source files, and generates JSON files that contain only message definitions. These definitions may then be passed to a translator, or processed into another format that meets the translator's needs.

### check

```
npm run check
```

The `check` script verifies the quality of the source code by running the [`lint`](#lint), [`test`](#test), and [`coverage`](#coverage) scripts. This script is executed in the continuous integration environment when commits are pushed to the master branch, and when pull requests are made to the master branch. It is what determines if a CI build "passes" or "fails".

### clean

```
npm run clean
```

The `clean` script deletes all files that are generated by development scripts, so that only source files remain.

### coverage

```
npm run coverage
```

The `coverage` script generates test coverage reports from the raw coverage data that is output when the [`test`](#test) and [`start`](#start) scripts are run. A textual report is printed to the terminal, and a more-detailed HTML report is output to `coverage/lcov-report`.

### devserver

```
npm run devserver [--back-end=<url> [--local-index=<path>]]
```

The `devserver` script starts a local development web server, listening at port 8080. The cspace-ui application may be accessed in a browser by opening the URL http://localhost:8080. As source code files are edited, changes are automatically detected and deployed into the dev server. The browser automatically reloads the page, so the latest changes are always visible.

If the `--back-end` option is supplied, the dev server acts as a proxy to the specified URL. This allows the locally running UI to connect to a remote CollectionSpace server regardless of CORS settings on that server. When the index.html file is retrieved from the server, the proxy attempts to rewrite it to inject the local UI that is under development. If this fails, or other changes are needed to the index.html file retrieved from the server, a local index file can be substituted by supplying the `local-index` option, specifying a path to a local HTML file.

> [!WARNING]
> SAML single sign-on will not work when using the `--back-end` option. If SSO is required while developing the UI, run the development server without `--back-end`, as described below.

If the `--back-end` option is not supplied, the page served by the dev server is the top-level [index.html](../../index.html) file. The URL of the CollectionSpace server to use can be set by specifying the `serverUrl` configuration property in index.html. Note that the CORS settings on that server must allow the origin `http://localhost:8080`.

To stop the dev server, type control-c in the shell in which it was started.

### lint

```
npm run lint
```

The `lint` script examines the source code for potential errors and deviations from the preferred coding style. Linting rules are [sourced from Airbnb](https://www.npmjs.com/package/eslint-config-airbnb), and enforce the [Airbnb style guide](https://github.com/airbnb/javascript).

### publish

```
npm [run] publish
```

The `publish` script publishes a new version of the cspace-ui module to the npm registry. This can only be done if you have appropriate permissions on the [cspace-ui](https://www.npmjs.com/package/cspace-ui) project on npmjs.com.

### start

```
npm [run] start [-- --file=<filename>]
```

The `start` script runs tests continuously. In this mode, a browser is opened, and tests are executed; then the browser will remain open, and as source files are edited and saved, the tests will rerun automatically. Test results are printed to the terminal. A single test file may be run continously by passing the `--file` parameter.

Test coverage data is output to the `coverage` directory, into a subdirectory named with the browser used. Test coverage reports may be generated from this data using the [`coverage`](#coverage) script.

To stop running tests continuously, type control-c in the shell in which testing was started. This closes the associated browser window.

### test

```
npm [run] test [-- --file=<filename>]
```

The `test` script runs tests once. In this mode, a browser is opened, and tests are executed; then the browser is closed, and results are printed to the terminal. A single test file may be run once by passing the `--file` parameter.

Test coverage data is output to the `coverage` directory, into a subdirectory named with the browser used. Test coverage reports may be generated from this data using the [`coverage`](#coverage) script.
