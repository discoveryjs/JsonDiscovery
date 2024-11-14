/**
 * Restores settings from storage
 * @returns {Promise}
 */
export function getSettings() {
    return chrome.storage.sync.get({
        expandLevel: 3,
        darkmode: 'auto',
        whatsnew: {}
    });
}
