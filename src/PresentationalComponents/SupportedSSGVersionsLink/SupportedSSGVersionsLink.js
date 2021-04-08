import React from 'react';
import { supportedConfigsLink } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const SupportedSSGVersionsLink = () => (
    <a target='_blank' rel='noopener noreferrer' href={ supportedConfigsLink }>
        Supported SSG versions <ExternalLinkAltIcon />
    </a>
);

export default SupportedSSGVersionsLink;
