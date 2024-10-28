import './discovery.css';
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
        styles: [{ type: 'link', href: 'sandbox.css' }],
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

    // FIXME: temprorary workaround since discovery reset context on setData()
    discovery.version = version;
    discovery.getRenderContext = function() {
        return {
            ...App.prototype.getRenderContext.call(this),
            version: this.version
        };
    };
}
