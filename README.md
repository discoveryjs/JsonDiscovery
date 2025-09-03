# JsonDiscovery

A browser extension that changes the way you're viewing JSON

[![Chrome Web Store](https://badgen.net/chrome-web-store/v/pamhglogfolfbmlpnenhpeholpnlcclo)](https://chromewebstore.google.com/detail/jsondiscovery/pamhglogfolfbmlpnenhpeholpnlcclo)
[![Mozilla Addons](https://badgen.net/amo/v/jsondiscovery)](https://addons.mozilla.org/en-US/firefox/addon/jsondiscovery/)

![JsonDiscovery](https://i.imgur.com/aMinbNB.png)

Add the extension to your browser:

* [Chrome Web Store](https://chromewebstore.google.com/detail/jsondiscovery/pamhglogfolfbmlpnenhpeholpnlcclo) (for Chrome & Edge, see [additional instructions](#chrome--edge))
* [Firefox Browser Add-ons](https://addons.mozilla.org/firefox/addon/jsondiscovery/) (see [additional instructions](#firefox))
* [Releases](https://github.com/discoveryjs/browser-extension-json-discovery/releases) section

JsonDiscovery is based on [Discovery.js](https://github.com/discoveryjs/discovery) which provides powerful features for rapid JSON analysis and beautiful reports on the fly!

## Most exciting features:

- Show JSON as an interactive tree with highlighting
- Easy an object or an array copy to clipboard
- Data structure signature (like in TypeScript)
- Data transformation with a query using Jora, suggestions on a query typing
- Customisation of JSON data presentation (using tables, lists and so on)
- Custom data presentation (a report) sharing by a link
- Works on any page with a valid JSON – URL/content type doesn't matter (might not work for urls with strict CSP in some cases)
- Works on local files (see [instructions for Chromium browsers](https://github.com/discoveryjs/browser-extension-json-discovery#working-with-local-files) below)
- Works offline (doesn't perform any network requests)

Read more on [Medium](https://blog.usejournal.com/changing-a-way-were-viewing-json-in-a-browser-51eda9103fa2)

## Additional instructions

### Chrome & Edge

By default installed extensions in Chromium browsers doesn't work in Incognito mode and has no access to local files. If you need these features, then you should enable it:

* Head to `chrome://extensions`
* Find `JsonDiscovery`
* Click `Details` button
* Enable `Allow in Incognito` to make JsonDiscovery work in Incognito mode
* Enable `Allow access to file URLs` to make JsonDiscovery work for local files

### Firefox

To make JsonDiscovery work in Firefox you should disable default JSON viewer:

* Head to `about:config`
* Search for `devtools.jsonview.enabled` setting
* Toggle the setting to `false`

## Development

Clone the repository, run `npm install` and start local development server with `npm run dev` command.

Add dev version of the extension to your browser:

- Chromium browsers (Chrome, Edge)
    * Head to `chrome://extensions/`
    * Click `Developer mode` in the top right corner
    * Click `Load unpacked`
    * Select a folder with extension source files (`build-chrome`)

- Firefox
    * Head to `about:debugging`
    * Click `Load Temporary Add-on`
    * Find the folder with extension source files (`build-firefox`) and select `manifest.json` file
