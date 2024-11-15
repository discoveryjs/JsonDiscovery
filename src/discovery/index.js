import { version } from '../../package.json';
import { App } from '@discoveryjs/discovery';
import joraHelpers from './jora-helpers';
import flashMessages from './flash-messages';
import navbar from './navbar';
import * as pages from './pages';

/**
 * Discovery initialization
 */
export function initDiscovery() {
    const discovery = new App({
        name: 'JsonDiscovery',
        description: 'Changing the way to explore JSON',
        version,
        styles: [{ type: 'link', href: 'discovery.css' }],
        embed: true,
        inspector: true,
        darkmodePersistent: true,
        extensions: [
            flashMessages,
            navbar,
            pages
        ],
        setup({ addQueryHelpers }) {
            addQueryHelpers(joraHelpers);
        }
    });

    discovery.nav.remove('index-page');
}

/**
 * Discovery empty page initialization
 */
export function initAppDiscovery() {
    const discovery = new App({
        name: 'JsonDiscovery',
        description: 'Changing the way to explore JSON',
        version,
        styles: [{ type: 'link', href: 'discovery.css' }],
        upload: { clipboard: true },
        embed: true,
        inspector: true,
        darkmodePersistent: true,
        extensions: [
            flashMessages,
            navbar,
            pages
        ],
        setup({ addQueryHelpers }) {
            addQueryHelpers(joraHelpers);
        }
    });

    discovery.nav.remove('index-page');
    discovery.renderPage('default');
}
