import React from 'react';
import { nowrap } from '@patternfly/react-table';

import RuleCell from './components/RuleCell';
import ProfileVersionCell from './components/ProfileVersionCell';

const rule = {
  title: <strong>Rule</strong>,
  Component: RuleCell,
};

export const profileVersion = (version, targetVersion, additionalProps) => ({
  dataLabel: `RHEL ${version.os_major_version}.${version.os_minor_version} -  SSG version ${version.ssg_version}`,
  title: (
    <>
      <strong>
        RHEL {version.os_major_version}.{version.os_minor_version}
      </strong>
      <br />
      SSG version {version.ssg_version}
    </>
  ),
  Component: (props) => (
    <ProfileVersionCell
      {...{
        version,
        targetVersion,
        ...props,
        ...additionalProps,
      }}
    />
  ),
  transforms: [nowrap],
});

export default [rule];
