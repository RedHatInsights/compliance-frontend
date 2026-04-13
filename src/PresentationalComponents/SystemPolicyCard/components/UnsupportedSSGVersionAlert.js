import React from 'react';
import propTypes from 'prop-types';
import { Popover, Alert } from '@patternfly/react-core';
import {
  OutlinedQuestionCircleIcon,
  ExternalLinkAltIcon,
} from '@patternfly/react-icons';
import { supportedConfigsLink } from '@/constants';
import { unsupportedSystemWarningMessage } from '@/constants';
import Link from '@redhat-cloud-services/frontend-components/InsightsLink';

const UnsupportedSSGVersionAlert = ({ ssgVersion, style, ...props }) => {
  const footerContent = (
    <Link to={supportedConfigsLink} rel="noopener noreferrer" target="_blank">
      Supported SSG versions
      <ExternalLinkAltIcon className="pf-v6-u-ml-xs" />
    </Link>
  );

  return (
    <Alert
      variant="warning"
      isInline
      style={style}
      title={
        <React.Fragment>
          Unsupported SSG version ({ssgVersion})
          <Popover
            position="right"
            bodyContent={unsupportedSystemWarningMessage}
            footerContent={footerContent}
          >
            <OutlinedQuestionCircleIcon
              style={{
                marginLeft: '.5em',
                cursor: 'pointer',
                color: 'var(--pf-t--global--text--color--200)',
              }}
            />
          </Popover>
        </React.Fragment>
      }
      {...props}
    />
  );
};

UnsupportedSSGVersionAlert.propTypes = {
  ssgVersion: propTypes.string,
  style: propTypes.object,
};

export default UnsupportedSSGVersionAlert;
