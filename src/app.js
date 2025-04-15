import { applyContainerStyles } from '@discoveryjs/discovery/utils';
import { connectToEmbedApp } from '@discoveryjs/discovery/embed';
import { getSettings, resetSettings, setSettings, subscribeSettings } from './settings.js';

function applyColorSchemeStyles(colorScheme) {
    applyContainerStyles(document.documentElement, colorScheme);
    localStorage.setItem('darkmode', colorScheme);
}

getSettings().then(settings => {
    const iframe = document.querySelector('iframe');

    applyColorSchemeStyles(settings.darkmode);
    connectToEmbedApp(iframe, (app) => {
        // settings
        app.setColorSchemeState(settings.darkmode);
        app.on('colorSchemeChanged', event => setSettings({ darkmode: event.value }));
        app.defineAction('getSettings', () => getSettings());
        app.defineAction('setSettings', (settings) => setSettings(settings));
        app.defineAction('resetSettings', (keys) => resetSettings(keys));
        subscribeSettings((delta) => app.notify('settings', delta));
        app.notify('settings', Object.fromEntries(Object.entries(settings).map(([k, v]) => [k, { newValue: v }])));

        // sync location
        // Note: should be last since lead to renders
        app.setRouterPreventLocationUpdate(true);
        app.setPageHash(location.hash);
        app.setLocationSync(true);

        iframe.classList.add('ready');
    });
});
