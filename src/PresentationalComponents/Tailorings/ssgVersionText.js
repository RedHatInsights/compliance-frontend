import React from 'react';
import propTypes from 'prop-types';
import { Content, ContentVariants, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { SupportedSSGVersionsLink } from 'PresentationalComponents';
import OsVersionText from './osVersionText';

export const SSGVersionText = ({ profile, newOsMinorVersion }) => (
  <Content component={ContentVariants.p}>
    SSG version: {profile?.benchmark.version}{' '}
    <Popover
      position="right"
      bodyContent={<SSGPopoverBody {...{ profile, newOsMinorVersion }} />}
      footerContent={<SupportedSSGVersionsLink />}
    >
      <span style={{ cursor: 'pointer' }}>
        <OutlinedQuestionCircleIcon className="grey-icon" />
      </span>
    </Popover>
  </Content>
);

SSGVersionText.propTypes = {
  profile: propTypes.object.isRequired,
  newOsMinorVersion: propTypes.string,
};

const SSGPopoverBody = ({ profile, newOsMinorVersion }) => (
  <Content style={{ fontSize: 'var(--pf-v6-c-popover--FontSize)' }}>
    <Content component="p">
      This is the latest supported version of the SCAP Security Guide (SSG) for{' '}
      <OsVersionText {...{ profile, newOsMinorVersion }} />
    </Content>
    <Content component="p">
      <OsVersionText {...{ profile, newOsMinorVersion }} /> systems assigned to
      this policy will report using this rule list.
    </Content>
  </Content>
);

SSGPopoverBody.propTypes = {
  profile: propTypes.object.isRequired,
  newOsMinorVersion: propTypes.string,
};
