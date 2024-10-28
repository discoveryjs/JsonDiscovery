import { copyToClipboardButton, downloadAsFileButton } from './common.js';

export default host => {
    host.page.define('default', {
        view: 'context',
        modifiers: {
            view: 'page-header',
            data: () => host.raw,
            content: [
                copyToClipboardButton,
                downloadAsFileButton,
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
    });
};
