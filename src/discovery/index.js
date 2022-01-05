import { Widget, router } from '@discoveryjs/discovery';
import flashMessages from './flash-messages';
import navbar from './navbar';
import * as pages from './pages';

/**
 * Discovery initialization
 * @param {Object} options
 * @param {Object} data
 * @returns {Discovery}
 */
export function initDiscovery(options, data) {
    const { settings, progressbar, raw } = options;
    const { darkmode = 'auto' } = settings;
    const discovery = new Widget(options.node, null, {
        inspector: true,
        darkmode,
        darkmodePersistent: false,
        styles: [{ type: 'link', href: chrome.runtime.getURL('discovery.css') }]
    });

    discovery.raw = raw; // TODO: move to context?
    discovery.apply(router);
    discovery.apply(flashMessages);
    discovery.apply(navbar);
    discovery.apply(pages);

    discovery.setPrepare((_, { addQueryHelpers }) => {
        addQueryHelpers({
            weight(current, prec = 1) {
                const unit = ['bytes', 'kB', 'MB', 'GB'];

                while (current > 1000) {
                    current = current / 1000;
                    unit.shift();
                }

                return current.toFixed(prec).replace(/\.0+$/, '') + unit[0];
            }
        });
    });

    return discovery.setDataProgress(
        data,
        {
            name: options.title,
            settings,
            createdAt: new Date().toISOString() // TODO fix in discovery
        },
        progressbar
    );
}
