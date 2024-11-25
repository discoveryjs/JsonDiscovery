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
    onClick: '="downloadAsFile".actionHandler()',
    text: 'Download as file'
};
