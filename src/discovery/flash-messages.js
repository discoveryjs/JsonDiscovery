import { createElement } from '@discoveryjs/discovery/utils';

export default function(host) {
    const flashMessagesContainer = createElement('div', 'flash-messages-container');
    const messageById = new Map();

    host.dom.container.append(flashMessagesContainer);

    host.action.define('flashMessage', async(config) => {
        const fragment = document.createDocumentFragment();
        const { id, type = 'success', data, content = 'text', remove = true } = typeof config === 'string'
            ? { data: config }
            : config;

        await host.view.render(fragment, {
            view: `alert-${type}`,
            content
        }, data);

        const el = fragment.firstChild;

        if (messageById.has(id)) {
            messageById.get(id).replaceWith(el);
        } else {
            flashMessagesContainer.append(el);
        }

        if (remove) {
            setTimeout(() => el.classList.add('ready-to-remove'), 1250);
            setTimeout(() => el.remove(), 1500);
        }

        if (id) {
            messageById.set(id, el);
        }
    });
}
