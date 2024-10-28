export function downloadAsFile(text) {
    const blob = new Blob([text], { type: 'application/json' });
    const location = (window.location.hostname + window.location.pathname)
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/-$/, '');

    const link = document.body.appendChild(document.createElement('a'));
    link.download = location.endsWith('-json') ? location.replace(/-json$/, '.json') : location + '.json';
    link.href = window.URL.createObjectURL(blob);
    link.click();
    link.remove();
}
