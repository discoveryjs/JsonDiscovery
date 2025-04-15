import { createElement } from '@discoveryjs/discovery/utils';

const demoData = {
    null: null,
    undefined: undefined,
    number: 123,
    string: 'hello world',
    link: 'http://example.com',
    nested: {
        name: 'JsonDiscovery',
        numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        objects: ['foo', 'bar', 'baz', 'qux', 'demo', 'data'].map(
            (tag, idx) => ({ id: idx + 1, tag, ...idx % 2 && { even: true } })
        )
    }
};

const testSupportedMonospaceFonts = (function() {
    const canvas = createElement('canvas');
    const ctx = canvas.getContext('2d');
    const testString1 = 'iiiii llll WWWWWWmmm';
    const testString2 = '12345678901234567890';
    const baselineFont = 'sans-serif';
    ctx.font = `16px ${baselineFont}`;
    const baselineWidth = ctx.measureText(testString1).width;

    function isMonospaceSupported(fontName) {
        ctx.font = `16px ${fontName}, ${baselineFont}`;
        const testWidth1 = ctx.measureText(testString1).width;
        const testWidth2 = ctx.measureText(testString2).width;

        return (
            testWidth1 !== baselineWidth && // is supported in general
            testWidth1 === testWidth2 // is monospace
        );
    }

    return (fontList) => fontList
        .filter(isMonospaceSupported)
        .map(fontName => fontName.trim().replace(/^(['"])(.*)\1$/, '$2'));
})();

const knownMonospaceFonts = [
    'monospace',
    'Anonymous Pro',
    'Camingo Code',
    'Cascadia Code',
    'Comic Mono',
    'Consolas',
    'Courier New',
    'Cousine',
    'DejaVu Sans Mono',
    'Envy Code R',
    'Fira Code',
    'IBM Plex Mono',
    'Inconsolata',
    'Input Mono',
    'Iosevka',
    'JetBrains Mono',
    'JetBrains Mono NL',
    'JuliaMono',
    'Liberation Mono',
    'Lucida Console',
    'Menlo',
    'Meslo LG',
    'Monaco',
    'Monaspace',
    'Monoid',
    'PT Mono',
    'Roboto Mono',
    'SFMono',
    'SFMono-Regular',
    'Sometype Mono',
    'Source Code Pro',
    'Ubuntu Mono',
    'Vera Sans Mono',
    'Victor Mono'
];

export default host => {
    let detachToggleColorScheme = () => {};
    let demoViews = null;

    async function initFonts() {
        const supportedFonts = testSupportedMonospaceFonts(knownMonospaceFonts);
        const probeEl = createElement('span', {
            style: 'font-family: var(--discovery-monospace-font-family)'
        });

        await host.dom.ready;
        host.dom.container.append(probeEl);

        const currentFonts = testSupportedMonospaceFonts(window.getComputedStyle(probeEl).fontFamily.split(/\s*,\s*/));
        const currentFont = currentFonts[0] || 'monospace';

        probeEl.remove();

        return {
            supportedFonts,
            currentFonts,
            currentFont
        };
    }

    const modifiers = [
        {
            view: 'section',
            header: 'text:"Color schema"',
            content: [
                {
                    view: 'block',
                    className: 'dark-mode-switcher',
                    name: 'darkmode',
                    label: 'Color schema',
                    postRender(el, props) {
                        let renderedValue;

                        detachToggleColorScheme();
                        detachToggleColorScheme = host.colorScheme.subscribe((_, state) => {
                            // notify parent with new value
                            props.onChange(state, props.name);

                            // prevent re-render if change comes from the toggle-group view
                            if (state === renderedValue) {
                                return;
                            }

                            renderedValue = state;
                            el.innerHTML = '';
                            host.view.render(el, {
                                view: 'toggle-group',
                                onChange(value) {
                                    renderedValue = value;
                                    host.colorScheme.set(value);
                                },
                                name: 'darkmode',
                                value: renderedValue,
                                data: [
                                    { value: 'light', text: 'Light' },
                                    { value: 'dark', text: 'Dark' },
                                    { value: 'auto', text: 'Auto' }
                                ]
                            });
                        }, true);
                    }
                }
            ]
        },
        {
            view: 'section',
            header: 'text:"Expand Level"',
            content: [
                {
                    view: 'input',
                    htmlType: 'number',
                    htmlMin: 1,
                    name: 'expandLevel',
                    value: '=expandLevel', // input doesn't allow non-string values, and #.expandLevel is a number
                    label: 'Expand Level'
                }
            ]
        },
        {
            view: 'section',
            when: false,
            className: 'monospace-settings',
            header: 'text:"Font settings"',
            content: {
                view: 'block',
                className: 'section-content',
                content: {
                    view: 'context',
                    proxy: true,
                    modifiers: [
                        {
                            view: 'block',
                            className: 'settings',
                            content: [
                                {
                                    view: 'select',
                                    context: async(data, context) => {
                                        return { ...context, fonts: await initFonts() };
                                    },
                                    data: '#.fonts.supportedFonts',
                                    name: 'monospaceFontFamily',
                                    value: 'monospaceFontFamily in $ or #.fonts.currentFont'
                                },
                                {
                                    view: 'input',
                                    htmlType: 'range',
                                    htmlMin: 10,
                                    htmlMax: 50,
                                    htmlStep: 0.5,
                                    name: 'monospaceFontSize',
                                    value: '=monospaceFontSize or 12'
                                },
                                {
                                    view: 'input',
                                    htmlType: 'range',
                                    htmlMin: 1.2,
                                    htmlMax: 2.5,
                                    htmlStep: 0.025,
                                    name: 'monospaceLineHeight',
                                    value: '=monospaceLineHeight or 1.5'
                                },
                                {
                                    view: 'input',
                                    htmlType: 'color',
                                    name: 'fmtPropertyColor',
                                    value: '=fmtPropertyColor or "#d17a8c"'
                                },
                                {
                                    view: 'input',
                                    htmlType: 'color',
                                    name: 'fmtAtomColor',
                                    value: '=fmtAtomColor or "#0f8dc2"'
                                },
                                {
                                    view: 'input',
                                    htmlType: 'color',
                                    name: 'fmtNumberColor',
                                    value: '=fmtNumberColor or "#0f8dc2"'
                                },
                                {
                                    view: 'input',
                                    htmlType: 'color',
                                    name: 'fmtStringColor',
                                    value: '=fmtStringColor or "#7faf20"'
                                },
                                {
                                    view: 'input',
                                    htmlType: 'color',
                                    name: 'fmtTypeColor',
                                    value: '=fmtTypeColor or "#a7994b"'
                                },
                                {
                                    view: 'input',
                                    htmlType: 'color',
                                    name: 'fmtFlagColor',
                                    value: '=fmtFlagColor or "#ff8030"'
                                }
                            ]
                        }
                    ],
                    content: [
                        {
                            view: 'block',
                            postRender(el, config, data, context) {
                                if (demoViews) {
                                    el.append(...demoViews);
                                } else {
                                    demoViews = [...el.childNodes];
                                }

                                el.style.setProperty('--discovery-monospace-font-family', context.monospaceFontFamily);
                                el.style.setProperty('--discovery-monospace-font-size', context.monospaceFontSize + 'px');
                                el.style.setProperty('--discovery-monospace-line-height', context.monospaceLineHeight);
                                el.style.setProperty('--discovery-fmt-property-color', context.fmtPropertyColor);
                                el.style.setProperty('--discovery-fmt-atom-color', context.fmtAtomColor);
                                el.style.setProperty('--discovery-fmt-number-color', context.fmtNumberColor);
                                el.style.setProperty('--discovery-fmt-string-color', context.fmtStringColor);
                                el.style.setProperty('--discovery-fmt-type-color', context.fmtTypeColor);
                                el.style.setProperty('--discovery-fmt-flag-color', context.fmtFlagColor);
                            },
                            content: {
                                view: 'context',
                                when: () => !demoViews,
                                content: [
                                    { view: 'struct', expanded: 2, data: demoData },
                                    { view: 'signature', expanded: 3, data: demoData },
                                    { view: 'source', syntax: 'json', source: JSON.stringify(demoData, null, 4)
                                        .replace(/(?<=,)\n\s+(?=\d)/g, ' ')
                                        // .replace
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        }
    ];

    host.page.define('settings', [
        'h1:"JsonDiscovery settings"',
        {
            view: 'context',
            context: async(_, context) => ({
                ...context,
                settings: await host.action.call('getSettings')
            }),
            data: '#.settings',
            modifiers,
            content: {
                view: 'block',
                className: 'changes-actions',
                async data(data, context) {
                    // host.colorScheme.set(context.darkmode);

                    return {
                        prev: {
                            ...data,
                            darkmode: context.darkmode
                        },
                        next: {
                            darkmode: context.darkmode,
                            expandLevel: Number(context.expandLevel),
                            monospaceFontFamily: context.monospaceFontFamily,
                            monospaceFontSize: context.monospaceFontSize && Number(context.monospaceFontSize),
                            monospaceLineHeight: context.monospaceLineHeight && Number(context.monospaceLineHeight),
                            fmtPropertyColor: context.fmtPropertyColor,
                            fmtAtomColor: context.fmtAtomColor,
                            fmtNumberColor: context.fmtNumberColor,
                            fmtStringColor: context.fmtStringColor,
                            fmtTypeColor: context.fmtTypeColor,
                            fmtFlagColor: context.fmtFlagColor
                        }
                    };
                },
                whenData: 'next.entries().[value != @.prev[key]]',
                content: [
                    // 'struct:{ ..., diff: next.entries().[value != @.prev[key]] }',
                    {
                        view: 'button-primary',
                        text: 'Save',
                        onClick(el, data) {
                            saveSettings(data.next);
                            host.scheduleRender();
                        }
                    }, {
                        view: 'button',
                        text: 'Reset',
                        async onClick() {
                            // await host.action.call('resetSettings');
                            host.scheduleRender();
                        }
                    }
                ]
            }
        }
    ]);

    /**
     * Saves settings to storage
     * @param {Object} settings
     */
    async function saveSettings(settings) {
        const { valid, errors } = validate(settings);

        if (valid) {
            await host.action.call('setSettings', settings);
            host.scheduleRender();
            host.action.call('flashMessage', 'Options saved.');
        } else {
            host.action.call('flashMessage', { type: 'danger', data: errors.join('\n') });
        }
    }

    /**
     * Validates settings
     * @param {Object} settings
     * @returns {Object}
     */
    function validate(settings) {
        const {
            expandLevel,
            darkmode
        } = settings;

        let valid = true;
        const errors = [];

        if (expandLevel !== undefined && (!expandLevel || !Number.isInteger(Number(expandLevel)))) {
            valid = false;
            errors.push('Expand level must be an integer number');
        }

        if (typeof darkmode === 'undefined' || !['auto', 'light', 'dark'].includes(darkmode)) {
            valid = false;
            errors.push('Darkmode must be a "light", "dark" or "auto"');
        }

        return { valid, errors };
    }
};
