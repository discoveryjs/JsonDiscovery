import { applyContainerStyles } from '@discoveryjs/discovery/src/core/utils/container-styles.js';
import { connectToEmbedApp } from '@discoveryjs/discovery/src/extensions/embed-host.js';
import { getSettings } from './settings.js';

const iframe = document.querySelector('iframe');

getSettings().then(settings => {
    applyContainerStyles(document.body, { darkmode: settings.darkmode });
    connectToEmbedApp(iframe, (app) => {
        // sync location
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
        });
    });
});
