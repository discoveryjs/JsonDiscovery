import copyText from '@discoveryjs/discovery/lib/core/utils/copy-text.js';

const splitter = {
    view: 'block',
    className: 'splitter'
};

export default host => {
    //
    // Primary section
    //
    host.nav.append({
        when: '#.page != "whatsnew"',
        data: '"hasNews".callAction()',
        whenData: true,
        content: 'text:"What\'s new"',
        onClick: () => {
            host.setPage('whatsnew');
        }
    });
    host.nav.append({
        when: '#.page = "discovery"',
        content: 'text:"Copy URL"',
        async onClick() {
            copyText(await host.action.call('permalink'));
            host.action.call('flashMessage', 'URL copied to clipboard', 'success');
        }
    });
    host.nav.append({
        when: '#.page != "default"',
        content: 'text:"Default view"',
        onClick() {
            host.setPage('default');
            history.replaceState(null, null, ' '); // ????
        }
    });
    host.nav.append({
        when: '#.page != "raw"',
        content: 'text:"Raw JSON"',
        onClick: () => host.setPage('raw'),
        tooltip: {
            position: 'trigger',
            content: 'text:"Show JSON as is"'
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
            host.action.call('flashMessage', 'JSON copied to clipboard', 'success');
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
};
