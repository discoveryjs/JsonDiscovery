import { randomId } from '@discoveryjs/discovery/utils';

const { showSaveFilePicker } = window;
export const isSaveFilePickerSupported = typeof showSaveFilePicker === 'function';

function getSuggestedName() {
    const { hostname, pathname } = window.location;
    const basename = (hostname ? hostname + pathname : pathname.replace(/^.*[\/\\]/, ''))
        .replace(/\.json$/, '')
        .replace(/[^a-z0-9]/gi, '-')
        .replace(/-$/, '');

    return basename + '.json';
}

// An effective way to compute total size;
// using `preEl.textContent.length` triggers concatenating all text nodes into a single long string,
// which leads to extra memory usage and can crash due to exceeding the string length limit (~500MB).
function getTotalSize(preEl) {
    let total = 0;

    for (let cursor = preEl.firstChild; cursor !== null; cursor = cursor.nextSibling) {
        total += cursor.nodeValue.length;
    }

    return total;
}

export const saveAsFile = isSaveFilePickerSupported
    ? async function saveAsFile(preEl, onProgress) {
        const suggestedName = getSuggestedName();
        const handler = await showSaveFilePicker({
            id: 'JsonDiscovery',
            suggestedName,
            types: [
                {
                    description: 'JSON',
                    accept: { 'application/json': ['.json'] }
                }
            ]
        });
        const writableStream = await handler.createWritable();
        let completed = 0;
        const baseProgress = {
            id: randomId(),
            filename: handler.name,
            done: false,
            completed,
            total: getTotalSize(preEl)
        };

        onProgress(baseProgress);

        // When JSON is loaded via the network, it can be split into small chunks;
        // writing into a stream in small chunks can be very slow.
        // Use a buffer to ensure that the chunk size is at least 1MB.
        let buffer = null;
        const FLUSH_BUFFER_SIZE = 1000000; // 1MB
        const flushBuffer = async() => {
            await writableStream.write(buffer);
            onProgress({ ...baseProgress, completed: completed += buffer.length });
            buffer = null;
        };

        for (let cursor = preEl.firstChild; cursor !== null; cursor = cursor.nextSibling) {
            buffer = buffer === null
                ? cursor.nodeValue
                : buffer + cursor.nodeValue;

            if (buffer.length > FLUSH_BUFFER_SIZE) {
                await flushBuffer();
            }
        }

        if (buffer !== null) {
            await flushBuffer();
        }

        onProgress({ ...baseProgress, done: true, completed });

        await writableStream.close();
    }
    : null;

export function downloadAsFile(preEl) {
    const suggestedName = getSuggestedName();
    const blob = new Blob([...preEl.childNodes].map(node => node.nodeValue), { type: 'application/json' });
    const link = document.body.appendChild(document.createElement('a'));

    link.download = suggestedName;
    link.href = window.URL.createObjectURL(blob);
    link.click();
    link.remove();
}
