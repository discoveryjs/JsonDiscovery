import { version } from '../../package.json';
import { App, embed } from '@discoveryjs/discovery';
import joraHelpers from './jora-helpers';
import flashMessages from './flash-messages';
import navbar from './navbar';
import * as pages from './pages';

const commonConfig = {
    name: 'JsonDiscovery',
    description: 'Changing the way to explore JSON',
    version,
    styles: [{ type: 'link', href: 'discovery.css' }],
    inspector: true,
    darkmodePersistent: true,
    setup({ addQueryHelpers }) {
        addQueryHelpers(joraHelpers);
    }
};
const embedExtension = (host) => {
    return embed.setup({
        onNotify(name, details) {
            switch (name) {
                case 'saveAsFile': {
                    const { id, done, filename, completed, total } = details;
                    host.action.call('flashMessage', {
                        id,
                        type: completed !== total ? 'primary' : 'success',
                        data: { filename, completed, total },
                        content: completed !== total
                            ? ['text:`Saving file ${filename}...`', 'progress{ progress: completed / total }']
                            : 'text:`File ${filename} saved`',
                        remove: done
                    });
                    break;
                }
                default:
                    console.warn('Unknown notification:', name, details); // eslint-disable-line no-console
            }
        }
    })(host);
};

/**
 * Discovery initialization
 */
export function initDiscovery() {
    const discovery = new App({
        ...commonConfig,
        extensions: [
            flashMessages,
            embedExtension,
            navbar,
            pages
        ]
    });

    discovery.nav.remove('index-page');
}

/**
 * Discovery empty page initialization
 */
export function initAppDiscovery() {
    const discovery = new App({
        ...commonConfig,
        mode: 'modelfree',
        upload: { clipboard: true },
        extensions: [
            embedExtension,
            flashMessages
        ]
    });

    // discovery.nav.remove('index-page');
}
