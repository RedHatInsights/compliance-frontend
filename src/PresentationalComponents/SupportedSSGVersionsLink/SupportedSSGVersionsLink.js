import React from 'react';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { supportedConfigsLink } from '@/constants';
import Link from '@redhat-cloud-services/frontend-components/InsightsLink';

const SupportedSSGVersionsLink = () => (
  <Link to={supportedConfigsLink} rel="noopener noreferrer" target="_blank">
    Supported SSG versions
    <ExternalLinkAltIcon className="pf-v6-u-ml-xs" />
  </Link>
);

export default SupportedSSGVersionsLink;
