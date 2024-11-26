import { createElement, createFragment } from '@discoveryjs/discovery/utils';

export default function(host) {
    const flashMessagesContainer = createElement('div', 'flash-messages-container');
    const messageById = new Map();

    host.dom.container.append(flashMessagesContainer);

    host.action.define('flashMessage', async(config) => {
        const fragment = createFragment();
        const { id, type = 'success', data, content = 'text', remove = true } = typeof config === 'string'
            ? { data: config }
            : config;

        await host.view.render(fragment, {
            view: `alert-${type}`,
            content
        }, data);

        let el = messageById.get(id);

        if (el !== undefined) {
            el.replaceChildren(fragment);
        } else {
            el = createElement('div', 'flash-message-wrapper', [fragment]);
            flashMessagesContainer.append(el);
        }

        if (remove) {
            messageById.delete(id);
            setTimeout(() => el.classList.add('ready-to-remove'), 1750);
            setTimeout(() => el.remove(), 2000);
        } else if (id) {
            messageById.set(id, el);
        }
    });
}
