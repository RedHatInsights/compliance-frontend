import React from 'react';
import { supportedConfigsLink } from '../UnsupportedSSGVersion/UnsupportedSSGVersion';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const SupportedSSGVersionsLink = () => (
    <a target='_blank' rel='noopener noreferrer' href={ supportedConfigsLink }>
        Supported SSG versions <ExternalLinkAltIcon />
    </a>
);

export default SupportedSSGVersionsLink;
