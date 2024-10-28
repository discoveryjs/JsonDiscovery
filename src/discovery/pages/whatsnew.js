import whatsnew from './whatsnew.md';

export default host => {
    host.action.define('hasNews', async() => {
        try {
            const { whatsnew } = await host.action.call('getSettings');

            return !whatsnew?.[host.version];
        } catch {
            return false;
        }
    });
    host.page.define('whatsnew', [
        {
            view: 'page-header',
            content: 'h1:"What\'s new"'
        }, {
            view: 'markdown',
            source: whatsnew,
            postRender: () =>
                host.action.call('setSettings', {
                    whatsnew: {
                        [host.version]: true
                    }
                })
        }
    ]);
};
