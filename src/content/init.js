import { Widget, router, complexViews } from '@discoveryjs/discovery/dist/lib.umd.js';
import settingsPage from '../settings';
import { WRAPPER_NODE } from '../../core/constants';
import '@discoveryjs/discovery/dist/lib.css';
import './index.css';

/**
 * Initializes extension
 * @param {Function} getSettings
 */
export async function init(getSettings) {
    let json;
    let raw;

    const { firstElementChild } = document.body;
    let { textContent } = document.body;

    textContent = textContent.trim();

    if (
        (firstElementChild && firstElementChild.tagName === 'PRE') &&
        (textContent.startsWith('{') || textContent.startsWith('['))
    ) {
        try {
            json = JSON.parse(textContent);
        } catch (_) {}
    }

    if (json) {
        raw = document.body.innerHTML;

        document.body.innerHTML = '';

        document.body.style.margin = 0;
        document.body.style.padding = 0;
        document.body.style.height = '100%';
        document.body.style.border = 'none';
        document.body.style.webkitTextSizeAdjust = '100%';
        document.body.style['background-color'] = '#fff';
        document.body.classList.add(WRAPPER_NODE);

        const discoveryNode = document.createElement('div');
        discoveryNode.style.height = '100%';
        document.body.appendChild(discoveryNode);

        getSettings(settings => {
            initDiscovery({
                discoveryNode,
                raw,
                data: json,
                settings
            });
        });
    }
}

/**
 * Discovery initialization
 * @param {Object} options
 * @returns {Discovery}
 */
export function initDiscovery(options) {
    const { settings } = options;
    const discovery = new Widget(options.discoveryNode);

    discovery.apply(router);
    discovery.apply(complexViews);

    settingsPage(discovery);

    discovery.page.define('default', [
        {
            view: 'struct',
            expanded: parseInt(settings.expandLevel, 10) || 0
        }
    ]);

    discovery.view.define('raw', el => {
        const { raw } = discovery.context;
        const div = document.createElement('div');

        div.classList.add('user-select');
        div.innerHTML = raw;

        el.appendChild(div);
    });

    discovery.page.define('raw', [{
        view: 'raw'
    }]);

    discovery.addBadge(
        'Index',
        () => {
            discovery.setPage('default');
            history.replaceState(null, null, ' ');
        },
        (host) => host.pageId !== 'default'
    );
    discovery.addBadge(
        'Make report',
        () => discovery.setPage('report'),
        (host) => host.pageId !== 'report'
    );
    discovery.addBadge(
        'Settings',
        () => discovery.setPage('settings')
    );
    discovery.addBadge(
        'Raw',
        () => discovery.setPage('raw'),
        (host) => host.pageId !== 'raw'
    );
    discovery.addBadge(
        'Copy raw',
        function() {
            const { raw } = discovery.context;
            const div = document.createElement('div');
            div.innerHTML = raw;
            const rawText = div.textContent;
            const el = document.createElement('textarea');
            el.value = rawText;
            document.body.appendChild(el);
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);

            this.textContent = 'Copied!';
            setTimeout(() => {
                this.textContent = 'Copy raw';
            }, 700);
        },
        (host) => {
            if (host.pageId === 'raw') {
                document.body.classList.add('no-user-select');
            } else {
                document.body.classList.remove('no-user-select');
            }

            return host.pageId === 'raw';
        }
    );

    discovery.setData(
        options.data,
        {
            name: options.title,
            raw: options.raw,
            settings,
            createdAt: new Date().toISOString() // TODO fix in discovery
        }
    );

    return discovery;
}

/**
 * Restores settings from storage
 * @param {Function} cb
 */
export function getSettings(cb) {
    chrome.storage.sync.get({
        expandLevel: 3
    }, settings => {
        cb(settings);
    });
}
