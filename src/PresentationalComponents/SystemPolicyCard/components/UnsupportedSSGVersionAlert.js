import React from 'react';
import propTypes from 'prop-types';
import { Popover, Alert } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { supportedConfigsLink } from '@/constants';
import { unsupportedSystemWarningMessage } from '@/constants';

const UnsupportedSSGVersionAlert = ({ ssgVersion, style, ...props }) => {
  const footerContent = (
    <a target="_blank" rel="noopener noreferrer" href={supportedConfigsLink}>
      Supported SSG versions
    </a>
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
