import { applyContainerStyles } from '@discoveryjs/discovery/utils';
import { connectToEmbedApp } from '@discoveryjs/discovery/embed';
import { getSettings } from './settings.js';

function applyDarkmodeStyles(darkmode) {
    applyContainerStyles(document.documentElement, darkmode);
    localStorage.setItem('darkmode', darkmode);
}

getSettings().then(settings => {
    const iframe = document.querySelector('iframe');

    applyDarkmodeStyles(settings.darkmode);
    connectToEmbedApp(iframe, (app) => {
        // settings
        let darkmode = 'auto';

        switch (settings.darkmode) {
            case true:
                darkmode = 'dark';
                break;
            case false:
                darkmode = 'light';
                break;
        }

        app.setDarkmode(darkmode);
        app.on('darkmodeChanged', async event => {
            const settings = await getSettings();
            let darkmode = 'auto';

            switch (event.value) {
                case 'light':
                    darkmode = false;
                    break;
                case 'dark':
                    darkmode = true;
                    break;
            }

            chrome.storage.sync.set({ ...settings, darkmode });
            applyDarkmodeStyles(darkmode);
        });

        // sync location
        // Note: should be last since lead to renders
        app.setRouterPreventLocationUpdate(true);
        app.setPageHash(location.hash);
        addEventListener('hashchange', () => app.setPageHash(location.hash), false);
        app.on('pageHashChanged', (newPageHash, replace) => {
            if (replace) {
                location.replace(newPageHash);
            } else {
                location.hash = newPageHash;
            }
        });

        iframe.classList.add('ready');
    });
});
