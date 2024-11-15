import { applyContainerStyles } from '@discoveryjs/discovery/src/core/utils/container-styles.js';

applyContainerStyles(document.documentElement, localStorage.getItem('darkmode') || 'auto');
