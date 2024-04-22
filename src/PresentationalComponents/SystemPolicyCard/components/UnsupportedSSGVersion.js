import React from 'react';
import propTypes from 'prop-types';
import { Popover, Alert } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { supportedConfigsLink } from '@/constants';

const UnsupportedSSGVersion = ({ ssgVersion, style, ...props }) => {
  const bodyContent =
    'This system was using an incompatible version of the SSG at the time this report was generated.' +
    ' Assessment of rules failed/passed on this system is a best-guess effort and may not be accurate.';
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
          <Popover position="right" {...{ bodyContent, footerContent }}>
            <OutlinedQuestionCircleIcon
              style={{
                marginLeft: '.5em',
                cursor: 'pointer',
                color: 'var(--pf-v5-global--Color--200)',
              }}
            />
          </Popover>
        </React.Fragment>
      }
      {...props}
    />
  );
};

UnsupportedSSGVersion.propTypes = {
  ssgVersion: propTypes.string,
  style: propTypes.object,
};

export default UnsupportedSSGVersion;
