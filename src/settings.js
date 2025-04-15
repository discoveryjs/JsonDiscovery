const settings = Object.create(null);
const defaultSettings = {
    expandLevel: 3,
    darkmode: 'auto',
    whatsnew: {}
};
let listeners = [];
let getSettingPromise = null;

export function getSettings() {
    if (!getSettingPromise) {
        getSettingPromise = new Promise(async(resolve, reject) => {
            try {
                const storageValues = await chrome.storage.sync.get();

                // for backward compatibility, previously the values stored as boolean | 'auto'
                if (typeof storageValues.darkmode === 'boolean') {
                    storageValues.darkmode = storageValues.darkmode ? 'dark' : 'light';
                }

                chrome.storage.sync.onChanged.addListener((changes) => {
                    const oldSettings = Object.assign(Object.create(null), settings);

                    for (const [key, delta] of Object.entries(changes)) {
                        if (Object.hasOwn(delta, 'newValue')) {
                            settings[key] = delta.newValue;
                        } else if (Object.hasOwn(defaultSettings, key)) {
                            settings[key] = defaultSettings[key];
                        } else {
                            delete settings[key];
                        }
                    }

                    listeners.forEach(fn => fn(changes, oldSettings));
                });

                resolve(Object.assign(settings, defaultSettings, storageValues));
            } catch (e) {
                reject(e);
            }
        });
    }

    return getSettingPromise;
}

export function setSettings(delta) {
    let changed = false;

    for (const key in delta) {
        if (!Object.is(delta[key], settings[key])) {
            changed = true;
            break;
        }
    }

    return changed
        ? chrome.storage.sync.set(delta)
        : Promise.resolve();
}

export function resetSettings(keys) {
    if (typeof keys === 'string' || Array.isArray(keys)) {
        return chrome.storage.sync.remove(keys);
    }

    return chrome.storage.sync.clear();
}

export function subscribeSettings(callback) {
    listeners.push(callback);
    return () => {
        listeners = listeners.filter(elem => elem !== callback);
    };
}
