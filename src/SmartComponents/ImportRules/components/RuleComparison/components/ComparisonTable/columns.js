import React from 'react';
import { nowrap } from '@patternfly/react-table';

import { renderComponent } from 'Utilities/helpers';

import RuleCell from './components/RuleCell';
import ProfileVersionCell from './components/ProfileVersionCell';

const rule = {
  title: <strong>Rule</strong>,
  renderFunc: renderComponent(RuleCell),
};

export const profileVersion = (osVersion, ssgVersion, props) => {
  console.log('osVersion, ssgVersion', osVersion, ssgVersion);
  return {
    title: (
      <>
        <strong>RHEL {osVersion}</strong>
        <br />
        SSG version {ssgVersion}
      </>
    ),
    renderFunc: renderComponent(ProfileVersionCell, {
      columnOsVersion: osVersion,
      columnSsgVersion: ssgVersion,
      ...props,
    }),
    transforms: [nowrap],
  };
};

export default [rule];
