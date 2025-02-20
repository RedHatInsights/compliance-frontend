import React from 'react';
import propTypes from 'prop-types';
import {
  Text,
  TextVariants,
  TextContent,
  Popover,
} from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { SupportedSSGVersionsLink } from 'PresentationalComponents';
import OsVersionText from './osVersionText';

export const SSGVersionText = ({ profile, newOsMinorVersion }) => (
  <Text component={TextVariants.p}>
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
  </Text>
);

SSGVersionText.propTypes = {
  profile: propTypes.object.isRequired,
  newOsMinorVersion: propTypes.string,
};

const SSGPopoverBody = ({ profile, newOsMinorVersion }) => (
  <TextContent style={{ fontSize: 'var(--pf-v5-c-popover--FontSize)' }}>
    <Text>
      This is the latest supported version of the SCAP Security Guide (SSG) for{' '}
      <OsVersionText {...{ profile, newOsMinorVersion }} />
    </Text>
    <Text>
      <OsVersionText {...{ profile, newOsMinorVersion }} /> systems assigned to
      this policy will report using this rule list.
    </Text>
  </TextContent>
);

SSGPopoverBody.propTypes = {
  profile: propTypes.object.isRequired,
  newOsMinorVersion: propTypes.string,
};
