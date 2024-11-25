export const copyToClipboardButton = {
    view: 'button',
    text: 'Copy to clipboard',
    async onClick(_, __, host) {
        await host.actions.copyToClipboard();
        host.actions.flashMessage('JSON copied to clipboard');
    }
};

export const downloadAsFileButton = {
    view: 'button',
    when: '#.actions.downloadAsFile',
    onClick: '="downloadAsFile".actionHandler()',
    text: 'Download as file'
};

export const saveAsFileButton = {
    view: 'button',
    when: '#.actions.saveAsFile',
    onClick: '="saveAsFile".actionHandler()',
    text: 'Save as file...'
};
