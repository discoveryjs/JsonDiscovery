import { copyText } from '@discoveryjs/discovery/lib/core/utils/copy-text.js';

const splitter = {
    view: 'block',
    className: 'splitter'
};

export default host => {
    //
    // Main section
    //
    host.nav.prepend({
        when: '#.page != "whatsnew"',
        data: '"hasNews".callAction()',
        whenData: true,
        content: 'text:"What\'s new"',
        onClick: () => {
            host.setPage('whatsnew');
        }
    });
    host.nav.prepend({
        when: '#.page = "discovery"',
        content: 'text:"Copy URL"',
        async onClick() {
            copyText(await host.action.call('permalink'));
            host.action.call('flashMessage', 'URL copied to clipboard');
        }
    });
    host.nav.prepend({
        when: '#.page != "raw"',
        content: 'text:"Raw JSON"',
        onClick: () => host.setPage('raw'),
        tooltip: {
            position: 'trigger',
            content: 'text:"Show JSON as is"'
        }
    });
    host.nav.prepend({
        when: '#.page != "default"',
        content: 'text:"Default view"',
        onClick() {
            host.setPage('default');
            history.replaceState(null, null, ' '); // ????
        }
    });

    //
    // Burger menu
    //
    host.nav.menu.append({
        content: 'text:"Download JSON as file"',
        onClick(_, { hide }) {
            hide();
            host.action.call('downloadAsFile');
        }
    });
    host.nav.menu.append({
        content: 'text:"Copy JSON to clipboard"',
        async onClick(_, { hide }) {
            hide();
            await host.action.call('copyToClipboard');
            host.action.call('flashMessage', 'JSON copied to clipboard');
        }
    });

    host.nav.menu.append(splitter);
    host.nav.menu.append({
        content: 'text:"What\'s new"',
        onClick(_, { hide }) {
            hide();
            host.setPage('whatsnew');
        }
    });

    host.nav.menu.append(splitter);
    host.nav.menu.append({
        content: 'text:"Settings"',
        onClick(_, { hide }) {
            hide();
            host.setPage('settings');
        }
    });

    //
    // Secondary section
    //
    host.nav.primary.append({
        name: 'github',
        href: 'https://github.com/discoveryjs/JsonDiscovery',
        external: true
    });
};
