export default host => {
    host.view.define('label', function(el, config = {}) {
        const { text } = config;

        el.appendChild(document.createTextNode(String(text)));
    }, { tag: 'label' });

    host.view.define('fieldset', function(el, config, data, context) {
        const { onChange, onInit } = config;
        let { content } = config;
        const { label } = content;

        if (!Array.isArray(content)) {
            content = [content, { view: 'label', text: label }];
        }

        content.forEach(view => {
            view.onInit = onInit;
            view.onChange = onChange;
        });

        host.view.render(el, content, data, context);
    });

    let detachToggleDarkMode = () => {};

    const modifiers = [
        {
            view: 'block',
            className: 'dark-mode-switcher',
            name: 'darkmode',
            label: 'Color schema',
            postRender: (el, opts, data, context) => {
                let selfValue;

                detachToggleDarkMode();
                detachToggleDarkMode = host.darkmode.subscribe((value, mode) => {
                    const newValue = mode === 'auto' ? 'auto' : value;

                    if (newValue === selfValue) {
                        return;
                    }

                    el.innerHTML = '';
                    selfValue = newValue;
                    host.view.render(el, {
                        view: 'toggle-group',
                        onChange: value => {
                            selfValue = value;
                            host.darkmode.set(value);
                            saveSettings(Object.assign(context, { darkmode: value }));
                        },
                        value: newValue,
                        data: [
                            { value: false, text: 'Light' },
                            { value: true, text: 'Dark' },
                            { value: 'auto', text: 'Auto' }
                        ]
                    }, null, { widget: host });
                }, true);
            }
        },
        {
            view: 'input',
            htmlType: 'number',
            htmlMin: 0,
            name: 'expandLevel',
            value: '#.expandLevel+""', // input doesn't allow non-string values, and #.expandLevel is a number
            label: 'Expand Level'
        }
    ].map(content => ({ view: 'fieldset', content }));

    host.page.define('settings', async function(el, data) {
        if (!data) {
            return;
        }

        const settings = await host.query('"getSettings".callAction()', data);

        host.view.render(el, [
            'h1:"JsonDiscovery settings"',
            {
                view: 'context',
                modifiers,
                content: [
                    {
                        view: 'button-primary',
                        content: 'text:"Save"',
                        onClick: (el, data, context) => {
                            saveSettings(context);
                        }
                    }
                ]
            }
        ], {}, settings);
    });

    /**
     * Saves settings to storage
     * @param {Object} settings
     */
    function saveSettings(settings) {
        const { valid, errors } = validate(settings);

        if (valid) {
            host.query(`"setSettings".callAction(${JSON.stringify(settings)})`, host.data);

            host.action.call('flashMessage', 'Options saved.', 'success');
        } else {
            host.action.call('flashMessage', errors.join(' '), 'danger');
        }
    }

    /**
     * Validates settings
     * @param {Object} settings
     * @returns {Object}
     */
    function validate(settings) {
        const { expandLevel, darkmode } = settings;

        let valid = true;
        const errors = [];

        if (!expandLevel || !Number.isInteger(Number(expandLevel))) {
            valid = false;
            errors.push('Expand level must be an integer number!');
        }

        if (typeof darkmode === 'undefined' || !(typeof darkmode === 'boolean' || darkmode === 'auto')) {
            valid = false;
            errors.push('Darkmode must be a true, false or auto');
        }

        return { valid, errors };
    }
};
