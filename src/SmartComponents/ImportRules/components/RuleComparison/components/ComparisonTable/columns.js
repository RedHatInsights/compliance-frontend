import React from 'react';
import { nowrap } from '@patternfly/react-table';

import RuleCell from './components/RuleCell';
import ProfileVersionCell from './components/ProfileVersionCell';

const rule = {
  title: <strong>Rule</strong>,
  Component: RuleCell,
};

export const profileVersion = (osVersion, ssgVersion, props) => {
  console.log('osVersion, ssgVersion', osVersion, ssgVersion);
  return {
    dataLabel: 'Test',
    title: (
      <>
        <strong>RHEL {osVersion}</strong>
        <br />
        SSG version {ssgVersion}
      </>
    ),
    Component: (props) => (
      <ProfileVersionCell
        {...{
          columnOsVersion: osVersion,
          columnSsgVersion: ssgVersion,
          ...props,
        }}
      />
    ),
    transforms: [nowrap],
  };
};

export default [rule];
