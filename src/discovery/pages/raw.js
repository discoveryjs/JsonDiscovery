import { copyToClipboardButton, downloadAsFileButton } from './common.js';

export default host => {
    host.view.define('raw', async function(el, config, data) {
        const contentEl = el.appendChild(document.createElement('pre'));
        const {
            firstSliceText,
            firstSliceSize,
            fullSize
        } = data;

        contentEl.className = 'content';
        contentEl.append(firstSliceText);

        if (firstSliceSize < fullSize) {
            this.render(el, {
                view: 'alert-warning',
                className: 'too-big-json',
                content: [
                    'text:`JSON is too big (${fullSize.weight()} bytes), only first ${firstSliceSize.weight()} is shown. Output the entire JSON may cause to browser\'s tab freezing for a while. `',
                    {
                        view: 'button',
                        content: 'text:"Show all"',
                        onClick(el) {
                            const alertEl = el.parentNode;

                            alertEl.textContent = 'Output entire JSON...';

                            setTimeout(async() => {
                                const { json } = await host.action.call('getRawFull');

                                contentEl.textContent = json;
                                alertEl.remove();
                            }, 50);
                        }
                    }
                ]
            }, {
                firstSliceSize,
                fullSize
            });
        }
    });

    host.page.define('raw', [
        {
            view: 'page-header',
            content: [
                copyToClipboardButton,
                downloadAsFileButton
            ]
        },
        {
            view: 'raw',
            data: '"getRaw".callAction()'
        }
    ]);
};
