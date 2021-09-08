import React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { supportedConfigsLink } from '@/constants';

const SupportedSSGVersionsLink = () => (
  <a target="_blank" rel="noopener noreferrer" href={supportedConfigsLink}>
    Supported SSG versions <ExternalLinkAltIcon />
  </a>
);

export default SupportedSSGVersionsLink;
