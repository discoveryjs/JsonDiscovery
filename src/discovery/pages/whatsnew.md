## 1.17.0

* Reworked the computation graph on the discovery page with improved visuals and complex-graph layout
* Added [`text-diff`](https://discoveryjs.github.io/discovery/#views-showcase:text-diff) view
* Extended `struct` view:
   * Added support for displaying error values (when `is error` is true)
   * Added a default image-like content string detection annotation: when a string value is identified as image-like content, a badge `image` is displayed before the string, showing an image preview on hover
* New jora methods and assertions:
   * JSON methods: `jsonParse()`, `jsonStringify()`, and `jsonInfo()` (the latter based on `stringifyInfo()` from [`json-ext`](https://github.com/discoveryjs/json-ext))
   * Image like content methods: `imagecontent()`, `imagedatauri()` and `imagesrc()`
   * New assertions: `imagecontent`, `imagedatauri`, `imagesrc` and `error`, e.g. `expr is imagedatauri`
* Extended `limit` option for supported web views to accept an object with optional properties: `{ start, startTolerance, base, tolerance }`
* Updated `discovery.js` to version `1.0.0-beta.99`
* Updated `jora` to version `1.0.0-beta.13`

## 1.16.0

- Support for loading `gzip` and `deflate` encoded data in sandbox. Encoding is detected by inspecting the payload header, enabling automatic decoding prior to standard data decoding or parsing.
- Introduced experimental [text-based rendering](https://github.com/discoveryjs/discovery/releases/tag/1.0.0-beta.94)
- Updated `discovery.js` to version `1.0.0-beta.95`

## 1.15.0

- Migrated to Manifest V3, eliminating warnings about the extension's future support
- Achieved nearly zero impact on regular pages (non-JSON documents)
- Enhanced performance for handling large JSON files (>100MB)
- Clicking the extension button now opens a playground where JSON can be loaded from a file or clipboard
- Updated `discovery.js` to version `1.0.0-beta.91`
- Updated `jora` to version `1.0.0-beta.13`

## 1.14.0

### Discover

- Report page renamed to "Discover"

### Misc

- Added "Copy URL" button
- Updated `discovery.js` to the `1.0.0-beta.82` version ([release notes](https://github.com/discoveryjs/discovery/releases/tag/v1.0.0-beta.82))

## 1.13.5

### Interface & Views

- Reworked the report page to include a query graph and an enhanced query editor.
- Added a "Copy report as page hash" button.
- Implemented [`tooltip`](#views-showcase&!anchor=tooltip) as an option for all views.
- Introduced new options and improvements for the `struct`, `markdown`, and `source` views.
- Changed the default rendering of arrays in a table cell to display the number of elements instead of `[…]`.

See details in [Discovery.js release notes](https://github.com/discoveryjs/discovery/releases).

### Jora Query Language

- **New Methods**:
   - **String and array processing**: Added `indexOf()`, `lastIndexOf()`, `replace()`, `toLowerCase()`, `toUpperCase()`, and `trim()` methods.
   - **Statistics**: Introduced `min()`, `max()`, `numbers()`, `sum()`, `avg()`, `count()`, `variance()`, `stdev()`, `percentile()` (with alias `p()`), and `median()`.
   - **Math**: Added a suite of math methods such as `abs()`, `acos()`, and many others, aligning closely with JavaScript's `Math` object functions.
- **New Operators and Syntax Enhancements**:
   - Introduced the nullish coalescing operator (`??`).
   - Added [assertions](https://discoveryjs.github.io/jora/#article:jora-syntax-assertions) to enhance conditional checks with the `is` operator, e.g., `is number` or `is not (number or string)`.
   - Provided basic support for function arguments in the syntax, enabling `$arg => expr` and `($a, $b) => expr` forms.
   - Updated queries to start with a pipeline operator, e.g., `| expr`.
   - Modified the ternary operator to allow optional components, enabling syntaxes like `expr ? : []`, `expr ? 1`, and `expr?`, with a default structure of `expr ? $ : undefined` when parts are omitted.

For more details, see the [Jora release notes](https://github.com/discoveryjs/jora/releases) for versions between 1.0.0-beta.7 & 1.0.0-beta.10.
