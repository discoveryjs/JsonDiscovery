## next

- Migrated to Manifest V3, eliminating warnings about the extension's future support
- Achieved nearly zero impact on regular pages (non-JSON documents)
- Enhanced performance for handling large JSON files (>100MB)
- Clicking the extension button now opens a playground where JSON can be loaded from a file or clipboard
- Updated `discovery.js` to version `1.0.0-beta.91`
- Updated `jora` to version `1.0.0-beta.13`

## 1.14.1 (20-05-2024)

* Fixed issue when "Pretty print" bar is visible during the loading in Chrome
* Updated `discovery` to `1.0.0-beta.83`

## 1.14.0 (02-04-2024)

* Updated `discovery` to `1.0.0-beta.82`
* Renamed `report` page to `discovery`
* Added "Copy URL" button

## 1.13.5 (07-03-2024)

* Updated `discovery` to `1.0.0-beta.81`
* Added "What's new" page

## 1.13.4 (29-09-2023)

* Fixed JSON detection in Chrome browser
* Fixed JSON detection in Edge browser

## 1.13.3 (08-09-2022)

* Fixed JSON parsing error issue when data loading from a slow responding server (#82)

## 1.13.2 (06-09-2022)

* Fixed copy to clipboard in FireFox
* Updated `discovery` to `1.0.0-beta.68`

## 1.13.1 (18-07-2022)

* Fixed manifest permissions

## 1.13.0 (15-07-2022)

* Fixed bug when CSP broke JSON display on the page
* Fixed work of extension for raw.github* pages
* Updated `esbuild` to `0.14.49`
* Updated `discovery` to `1.0.0-beta.66`

## 1.12.2 (29-04-2022)

* Updated `discovery` to `1.0.0-beta.65`

## 1.12.1 (11-03-2022)

* Fixed false positive initialization when first `<pre>` in a document is empty or contains a HTML markup (#77)

## 1.12.0 (08-03-2022)

* Updated `discovery` to `1.0.0-beta.64`
* Reduced initialization time (up to 7 times) for the regular pages (not a JSON data) by lazy loading of main source code only if JSON is successfully loaded and parsed

## 1.11.2 (01-08-2021)

* Fixed "Download as file" button on default page

## 1.11.1 (10-05-2021)

* Fixed copying JSON to clipboard on http hosts

## 1.11.0 (03-04-2021)

* Improved data loading and page style changes rollback when data is not a JSON or broken JSON
* Added progressbar on data loading
* Added inspect button to navigation bar
* Rearranged navigation bar buttons to be more compact
* Added "Copy to clipboard" and "Download as file" buttons to default page header
* Added "Collapse all" and "Expand all" buttons to default page header
* Reworked raw JSON page:
    * Added "Copy to clipboard" and "Download as file" buttons to page header
    * Show only first 100KB when JSON is big to avoid browser's freezing
    * Various improvements around performance

## 1.10.3 (01-04-2021)

* Fixed bug, when extension could overlap part of content on pages with plain/text

## 1.10.2 (18-02-2021)

* Fixed manifest to get icons accessible

## 1.10.1 (18-02-2021)

* Fixed bug where an extension might not load on some pages with strict CSP rules
* Updated `discovery` to `1.0.0-beta.55`

## 1.10.0 (09-02-2021)

* Build system reworked using `esbuild`
* Fixed bug with darkmode styles applied to the part of the page in Chrome
* Fixed darkmode "blinking" issue
* Disabled "inspector" when you press `Alt` button
* Fixed bug when you have to reload page to apply settings
* Increased performance by splitting code loading into two stages (Chrome & Safari only)
* Style isolation via ShadowDOM
* Fixed issues when CSP blocked some images and icons
* Updated `discovery` to `1.0.0-beta.53`

## 1.9.2 (12-11-2020)

* Updated `discovery` to `1.0.0-beta.50`

## 1.9.1 (08-11-2020)

* Fixed `raw` mode css
* Improved raw copy to clipboard performance
* Flash message moved to the right bottom corner

## 1.9.0 (07-11-2020)

* "Download JSON" button
* Fixed `raw` mode css

## 1.8.1 (06-11-2020)

* Fixed bug with hidden `pre` on some sites
* Fixed bug with non-working `raw` mode

## 1.8.0 (03-11-2020)

* Increased performance when working with huge JSON-documents
* Updated `discovery` to `1.0.0-beta.47`
* Fixed table font color

## 1.7.1 (21-10-2020)

* Updated `discovery` to `1.0.0-beta.45`
* Fixed CSP-related crash on some pages

## 1.7.0 (21-10-2020)

* Updated `discovery` to `1.0.0-beta.44`
* Updated `discovery-cli` to `1.14.0`
* Dark mode support

## 1.6.6 (06-10-2020)

* Removed settings button from the burger menu

## 1.6.5 (04-10-2020)

* Updated `discovery` to `1.0.0-beta.40`
* Updated `discovery-cli` to `1.13.0`

## 1.6.4 (17-05-2020)

* Updated `discovery` to `1.0.0-beta.36`
* Updated `discovery-cli` to `1.9.1`

## 1.6.3 (25-04-2020)

* CSS style isolation marker by CSS content hash
* Updated `discovery` to `1.0.0-beta.31`
* Updated `discovery-cli` to `1.8.1`

## 1.6.2 (18-02-2020)

* Updated `discovery` to `1.0.0-beta.30`
* CSS style isolation via `discovery-cli`
* Fixed issue with suggestion popup on `report` page

## 1.6.1 (18-02-2020)

* Updated `discovery` to `1.0.0-beta.28` and `jora` to `1.0.0-alpha.13`

## 1.6.0 (18-12-2019)

* Updated `discovery` to `1.0.0-beta.27` [with new `jora` features](https://github.com/discoveryjs/jora/releases/tag/v1.0.0-alpha.11)
* Fixed json parsing in cases when user has browser extensions which inject some content into pages with json

## 1.5.5 (12-12-2019)

* Moved back missed build script
* Fixed plugin initialization issues
* Updated `discovery` to `1.0.0-beta.23`
* Fixed pie charts rendering in FireFox
* Updated npm build deps

## 1.5.4 (11-09-2019)

* Do not use second request, match JSON on markup instead

## 1.5.3 (01-09-2019)

* Fixed false extension triggering on some sites

## 1.5.2 (06-08-2019)

* Fixed style pollution

## 1.5.1 (01-08-2019)

* Fixed issue with broken styles on several sites

## 1.5.0 (30-07-2019)

* Fixed various CSP issues
* Fixed extension malfunction on sites with JSON-like content
* Updated `discovery` to `1.0.0-beta.16` version

## 1.4.3 (30-06-2019)

* Updated `discovery`

## 1.4.2 (25-05-2019)

* Extension now available for Firefox
* Refactored build for multiple targets (Chrome, Firefox)

## 1.4.1 (29-03-2019)

* Settings page now opens in tab instead of pop-up window

## 1.4.0 (09-03-2019)

* Settings page is now using `discovery` under hood
* Some pages with CSP-header may brake extension functionality ([Crome bug](https://bugs.chromium.org/p/chromium/issues/detail?id=816121)). For such cases added fallback
* Extension now check if content is HTML before trying to parse JSON

## 1.3.1 (13-02-2019)

* Updated `discovery` and `jora`

## 1.3.0 (26-12-2018)

* Updated `discovery` (new stunning `jora` suggestions on report page)

## 1.2.0 (12-12-2018)

* Updated `discovery` (various buxfixes and some `jora` syntax improvements)

## 1.1.1 (30-11-2018)

* Refactored build process

## 1.1.0 (25-11-2018)

* Replaced bundled discovery with its npm version

## 1.0.7 (23-11-2018)

* Updated discovery and jora
* Fixed issues with raw content copying
* Another navigation issues fix

## 1.0.6 (22-11-2018)

* Views list fix

## 1.0.5 (22-11-2018)

* Updated Discovery
* Fixed issues with navigation

## 1.0.4 (22-11-2018)

* Initial GitHub release
