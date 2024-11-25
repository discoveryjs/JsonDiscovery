import { copyToClipboardButton, downloadAsFileButton, saveAsFileButton } from './common.js';

export default host => {
    host.page.define('default', {
        view: 'switch',
        content: [
            { when: 'no #.datasets', content: 'preset/welcome-block' },
            { content: {
                view: 'context',
                modifiers: {
                    view: 'page-header',
                    data: () => host.raw,
                    content: [
                        copyToClipboardButton,
                        downloadAsFileButton,
                        saveAsFileButton,
                        {
                            view: 'block',
                            data: '"getSettings".callAction()',
                            content: [
                                function(el, config, data, context) {
                                    context.expandLevel = data.expandLevel;
                                },
                                {
                                    view: 'button',
                                    className: 'collapse-all',
                                    tooltip: 'text:"Collapse all"',
                                    onClick(el, data, { onChange }) {
                                        onChange(1, 'expandLevel');
                                    },
                                    postRender(el, config, data, context) {
                                        context.onChange = config.onChange;
                                    }
                                },
                                {
                                    view: 'button',
                                    className: 'expand-all',
                                    tooltip: 'text:"Expand all"',
                                    onClick(el, data, { onChange }) {
                                        onChange(100, 'expandLevel');
                                    },
                                    postRender(el, config, data, context) {
                                        context.onChange = config.onChange;
                                    }
                                }
                            ]
                        }
                    ]
                },
                content: {
                    view: 'struct',
                    expanded: '=+(#.expandLevel or "getSettings".callAction().expandLevel)',
                    data: '#.data'
                }
            } }
        ]
    });
};
