import { version } from '../../package.json';
import { App, embed } from '@discoveryjs/discovery';
import joraHelpers from './jora-helpers';
import flashMessages from './flash-messages';
import navbar from './navbar';
import * as pages from './pages';

const settingToCssProperties = {
    monospaceFontFamily: 'monospace-font-family',
    monospaceFontSize: ['monospace-font-size', value => value + 'px'],
    monospaceLineHeight: 'monospace-line-height',
    fmtPropertyColor: 'fmt-property-color',
    fmtAtomColor: 'fmt-atom-color',
    fmtNumberColor: 'fmt-number-color',
    fmtStringColor: 'fmt-string-color',
    fmtFlagColor: 'fmt-flag-color'
};
const commonConfig = {
    name: 'JsonDiscovery',
    description: 'Changing the way to explore JSON',
    version,
    styles: [{ type: 'link', href: 'discovery.css' }],
    inspector: true,
    colorSchemePersistent: true,
    setup({ addQueryHelpers }) {
        addQueryHelpers(joraHelpers);
    }
};
const embedExtension = (host) => {
    return embed.setup({
        onNotify(name, details) {
            switch (name) {
                case 'settings': {
                    // console.log('settings', details);
                    for (const [key, { newValue: value }] of Object.entries(details)) {
                        switch (key) {
                            case 'darkmode':
                                host.colorScheme.set(value || 'auto');
                                break;

                            default: {
                                if (Object.hasOwn(settingToCssProperties, key)) {
                                    const [name, format = value => value] = Array.isArray(settingToCssProperties[key])
                                        ? settingToCssProperties[key]
                                        : [settingToCssProperties[key]];
                                    const styleProperty = '--discovery-' + name;

                                    if (value) {
                                        host.dom.container.setProperty(styleProperty, format(value));
                                    } else {
                                        host.dom.container.removeProperty(styleProperty);
                                    }
                                }
                            }
                        }
                    }
                    break;
                }

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
    new App({
        ...commonConfig,
        mode: 'modelfree',
        upload: { clipboard: true },
        extensions: [
            embedExtension,
            flashMessages,
            function buttons(host) {
                host.nav.before('inspect', {
                    name: 'upload-data-from-clipboard',
                    when: '#.actions.uploadDataFromClipboard and #.datasets',
                    onClick: '=#.actions.uploadDataFromClipboard',
                    tooltip: {
                        position: 'trigger',
                        content: 'text:"Paste JSON from clipboard"'
                    }
                });
                // FIXME: use navButtons.unloadData instead, once issue with modelfree render cancel is solved
                host.nav.menu.append({
                    name: 'unload-data',
                    when: '#.actions.unloadData and #.datasets',
                    content: 'text:"Unload data"',
                    onClick() {
                        host.action.call('unloadData');
                        host.scheduleRender();
                    }
                });
                host.nav.primary.append({
                    name: 'github',
                    href: 'https://github.com/discoveryjs/JsonDiscovery',
                    external: true
                });
            }
        ]
    });
}
