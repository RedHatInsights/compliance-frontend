import React from 'react';
import { supportedConfigsLink } from '@redhat-cloud-services/frontend-components-inventory-compliance';

const SupportedSSGVersionsLink = () => (
    <a target='_blank' rel='noopener noreferrer' href={ supportedConfigsLink }>
        Supported SSG versions
    </a>
);

export default SupportedSSGVersionsLink;
