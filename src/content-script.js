import { applyContainerStyles, rollbackContainerStyles, copyText } from '@discoveryjs/discovery/utils';
import { connectToEmbedApp } from '@discoveryjs/discovery/embed';
import { getSettings, resetSettings, setSettings, subscribeSettings } from './settings.js';
import { downloadAsFile, saveAsFile } from './actions/download-as-file.js';

const BUFFER_SIZE = 4 * 64 * 1024;
const firstSliceMaxSize = 100 * 1000;
let documentFullyLoaded = document.readyState === 'complete';
let loadedTimer;
let disabledElements = [];
let pre = null;
let iframe = null;
let preCursor;
let prevCursorValue = '';
let dataStreamController = null;
let stylesApplied = false;
let totalSize = 0;
let buffer = '';
let firstSlice = '';

function raiseBailout(reason) {
    return Object.assign(new Error('Rollback'), { bailout: reason });
}

function buildFirstSlice(pre) {
    let slice = '';

    for (
        let cursor = pre.firstChild, left = firstSliceMaxSize;
        left > 0 && cursor !== null;
        cursor = cursor.nextSibling
    ) {
        const chunk = cursor.nodeValue;

        slice += left >= chunk.length ? chunk : chunk.slice(0, left);
        left -= chunk.length;
    }

    return slice;
}

const flushData = (settings) => {
    if (pre === null) {
        return;
    }

    while (true) {
        const isFirstChunk = preCursor === undefined;
        const chunkNode = isFirstChunk
            ? pre.firstChild
            // In some cases a browser appends new content to an existing text node
            // instead of creating new one. In this case, we are using the same text node
            // as on previous iteration and slice appended content as a chunk content.
            : preCursor.nodeValue !== prevCursorValue
                ? preCursor
                : preCursor.nextSibling;

        if (!chunkNode) {
            if (isFirstChunk && (documentFullyLoaded || pre.nextSibling)) {
                // bailout: first <pre> is empty
                throw raiseBailout('Empty input');
            }

            return;
        }

        if (chunkNode.nodeType !== Node.TEXT_NODE) {
            // bailout: not a text node -> a complex markup is not a JSON
            throw raiseBailout('Input not a text');
        }

        if (isFirstChunk) {
            if (/^\s*[{[]/.test(chunkNode.nodeValue)) {
                // probably JSON, accept an object or an array only to reduce false positive
                if (dataStreamController === null) {
                    if (iframe === null) {
                        pre.before(getIframe(settings));
                    }

                    return;
                }
            } else {
                // bailout: not a JSON or a non-object / non-array value
                throw raiseBailout('Not a JSON or a non-object / non-array value');
            }
        }

        const chunk = chunkNode === preCursor
            // slice a new content from a chunk node in case a content
            // was appended to an existing text node
            ? chunkNode.nodeValue.slice(prevCursorValue.length)
            : chunkNode.nodeValue;

        prevCursorValue = chunkNode === preCursor
            ? chunkNode.nodeValue
            : chunk;
        preCursor = chunkNode;

        totalSize += chunk.length;
        buffer += chunk;

        if (buffer.length > BUFFER_SIZE) {
            dataStreamController.enqueue(buffer);
            buffer = '';
        }
    }
};

function rollbackPageChanges(error) {
    cancelAnimationFrame(loadedTimer);
    rollbackContainerStyles(document.body);

    dataStreamController?.close();
    dataStreamController = null;

    if (iframe !== null) {
        iframe.remove();
        iframe = null;
    }

    // it might to take a lot of time to render large text,
    // so make it visible in next frame to allow styles rollback
    requestAnimationFrame(() => {
        if (disabledElements !== null) {
            disabledElements.forEach(({ element, hidden, remove }) =>
                remove ? element.remove() : (element.hidden = hidden)
            );
            disabledElements = null;
        }
    });

    if (error?.bailout) {
        console.warn('[JsonDiscovery] Bailout reason:', error.bailout); // eslint-disable-line no-console
    }
}

function isPre(element) {
    // This branch is used to override Edge's default JSON viewer
    if (element?.hasAttribute('hidden') && document.body?.dataset?.codeMirror) {
        // Creating a <style> element to hide all the elements in the body;
        // The [hidden] attribute is not effective for CodeMirror because "display: flex"
        // is assigned with !important. Utilizing a layer ensures that all previous rules are overridden.
        const styleEl = document.createElement('style');
        styleEl.append('@layer super-top-layer{body>:not(.discovery){display:none!important}}');

        // Inserting a <div> element as the first child of the body prevents JSON
        // parsing by Edge's default JSON viewer, especially for large JSON files (above 1MB).
        // Since we're replacing the functionality of the default viewer,
        // this approach is efficient in terms of performance and resource utilization.
        const fakeJsonEl = document.createElement('div');
        fakeJsonEl.hidden = true;
        fakeJsonEl.append('{}');

        // Add to DOM
        disableElement(fakeJsonEl, true);
        disableElement(styleEl, true);
        element.before(fakeJsonEl, styleEl);

        return element;
    }

    return element?.tagName === 'PRE' ? element : null;
}

function disableElement(element, remove = false) {
    disabledElements.push({
        element,
        hidden: element.hidden,
        remove
    });
    element.hidden = true;
}

function getIframe(settings) {
    if (iframe !== null) {
        return iframe;
    }

    iframe = document.createElement('iframe');
    iframe.className = 'discovery';
    iframe.src = chrome.runtime.getURL('sandbox.html');
    iframe.setAttribute('sandbox', 'allow-scripts allow-popups allow-modals');
    iframe.setAttribute('allow', 'clipboard-write');
    iframe.style.cssText = 'position: fixed; inset: 0; border: 0; width: 100%; height: 100%; visibility: hidden';

    // Check if scripts in the sandbox iframe work, otherwise rollback since we can't display anything.
    // The first script in the sandbox iframe sends message, it should be delivered before onload event fires
    {
        let scriptsWorks = false;
        const jsonDiscoverySandboxMessageHandler = e => {
            if (e.data === 'json-discovery-sandbox-scripts-work') {
                scriptsWorks = true;
            }
        };

        window.addEventListener('message', jsonDiscoverySandboxMessageHandler);
        iframe.onload = () => {
            window.removeEventListener('message', jsonDiscoverySandboxMessageHandler);

            if (!scriptsWorks) {
                rollbackPageChanges(raiseBailout('Scripts or postMessage() doesn\'t work in sandbox'));
            } else {
                // enable visibility on iframe load to avoid flash of white background when in dark mode
                iframe.style.visibility = 'visible';
            }
        };
    }

    connectToEmbedApp(iframe, (app) => {
        // settings
        app.setColorSchemeState(settings.darkmode);
        app.on('colorSchemeChanged', event => setSettings({ darkmode: event.value }));
        app.defineAction('getSettings', () => getSettings());
        app.defineAction('setSettings', (settings) => setSettings(settings));
        app.defineAction('resetSettings', (keys) => resetSettings(keys));
        subscribeSettings((delta) => app.notify('settings', delta));
        app.notify('settings', Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, { newValue: v }])));

        // actions
        app.defineAction('copyToClipboard', () => copyText(pre.textContent));

        if (typeof saveAsFile === 'function') {
            app.defineAction('saveAsFile', () => {
                // don't return a promise since it can cause an action timeout
                saveAsFile(pre, (details) => {
                    app.notify('saveAsFile', details);
                });
            });
        } else {
            app.defineAction('downloadAsFile', () => {
                downloadAsFile(pre);
            });
        }

        app.defineAction('permalink', () => window.location.toString());

        app.defineAction('getRaw', () => ({
            firstSliceText: firstSlice,
            firstSliceSize: firstSlice.length,
            fullSize: totalSize
        }));
        app.defineAction('getRawFull', () => ({
            json: pre.textContent
        }));

        app.defineAction('exit', () => {
            rollbackPageChanges();
        });

        // upload data
        app.uploadData(new ReadableStream({
            start(controller_) {
                dataStreamController = controller_;
            },
            async pull() {
                checkLoaded(await getSettings());
            },
            cancel() {
                dataStreamController = null;
            }
        }));

        // sync location
        // Note: should be last since lead to renders
        app.setRouterPreventLocationUpdate(true);
        app.setPageHash(location.hash);
        app.setLocationSync(true);

        // check load and appearance
        getSettings().then(checkLoaded);
    });

    return iframe;
}

async function checkLoaded(settings) {
    if (pre === null && !stylesApplied) {
        const firstElement = document.body?.firstElementChild;

        pre = isPre(firstElement) || isPre(firstElement?.nextElementSibling);

        if (pre) {
            disableElement(pre);

            // Chrome placed formatter container before <pre> in mid 2023
            // https://issues.chromium.org/issues/40282442
            if (firstElement !== pre) {
                disableElement(firstElement);
            }

            // Chrome moved formatter container after <pre>
            // https://github.com/chromium/chromium/commit/1ca95a7aedd55cafb40f11e839a02bf8cc7ef99d
            if (pre.nextElementSibling?.classList?.contains('json-formatter-container')) {
                disableElement(pre.nextElementSibling);
            }
        }
    }

    if (!settings || pre === null || preCursor === null) {
        return;
    }

    if (!stylesApplied) {
        stylesApplied = true;
        applyContainerStyles(document.body, settings.darkmode);
    }

    if (!documentFullyLoaded || preCursor === undefined) {
        flushData(settings);
        loadedTimer = requestAnimationFrame(() =>
            checkLoaded(settings).catch(rollbackPageChanges)
        );
        return;
    }

    if (pre !== null) {
        flushData(settings);

        if (buffer !== '') {
            dataStreamController.enqueue(buffer);
            buffer = '';
        }

        dataStreamController?.close();
        dataStreamController = null;
        firstSlice = buildFirstSlice(pre);
        preCursor = null;
        prevCursorValue = '';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    documentFullyLoaded = true;
    checkLoaded();
}, { once: true });
checkLoaded();
setTimeout(checkLoaded);
Promise.resolve().then(checkLoaded);
getSettings()
    .then(checkLoaded)
    .catch(rollbackPageChanges);

