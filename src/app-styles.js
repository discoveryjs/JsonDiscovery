import { applyContainerStyles, getLocalStorageValue } from '@discoveryjs/discovery/utils';

applyContainerStyles(document.documentElement, getLocalStorageValue('darkmode') || 'auto');
