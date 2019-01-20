/**
 * Restores settings from storage
 * @param {Function} cb
 */
function getSettings(cb) {
    chrome.storage.sync.get({
        expandLevel: 3,
        viewPresets: []
    }, settings => {
        cb(settings);
    });
}

let json;
let raw;

try {
    json = JSON.parse(document.body.innerText);
} catch (_) {}

if (json) {
    const iframe = document.createElement('iframe');
    const content = chrome.extension.getURL('pages/content.html');

    iframe.src = content;
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.frameBorder = 0;

    raw = document.body.innerHTML;
    document.body.innerHTML = '';

    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.userSelect = 'none';

    const wrapper = document.createElement('div');

    wrapper.style.position = 'absolute';
    wrapper.style.top = 0;
    wrapper.style.bottom = 0;
    wrapper.style.left = 0;
    wrapper.style.right = 0;

    document.body.appendChild(wrapper);
    wrapper.appendChild(iframe);

    iframe.addEventListener('load', () => {
        getSettings(settings => {
            let viewPresets = [];

            for (const item of settings.viewPresets) {
                const { host, presets } = item;

                const hostRe = new RegExp(host);

                if (hostRe.test(document.location.toString())) {
                    viewPresets = viewPresets.concat(presets);
                }
            }

            settings.viewPresets = viewPresets;

            iframe.contentWindow.postMessage({
                json,
                raw,
                hash: window.location.hash,
                title: document.location.href.replace(document.location.hash, ''),
                settings
            }, '*');
        });
    });

    let iframeHash = null;

    const setHash = (hash, replace) => {
        if (hash && window.location.hash !== hash) {
            if (replace) {
                history.replaceState('', document.title, window.location.pathname + window.location.search + hash);
            } else {
                window.location.hash = hash;
            }
        } else if (!hash && window.location.hash) {
            history.pushState('', document.title, window.location.pathname + window.location.search);
        }
        iframeHash = hash;
    };

    const onMessage = event => {
        setHash(event.data.hash, event.data.replace);

        if (event.data && event.data.openSettings) {
            if (chrome.runtime.openOptionsPage) {
                chrome.runtime.openOptionsPage();
            } else {
                window.open(chrome.runtime.getURL('pages/settings.html'));
            }
        }
    };

    window.addEventListener('message', onMessage);

    const onHashChange = () => {
        if (iframeHash !== null && iframeHash !== window.location.hash) {
            iframe.contentWindow.postMessage({
                hash: window.location.hash
            }, '*');
        }
    };

    window.addEventListener('hashchange', onHashChange);

    window.addEventListener('beforeunload', () => {
        window.removeEventListener('message', onMessage);
        window.removeEventListener('hashchange', onHashChange);
    });
}
