import React from 'react';
import propTypes from 'prop-types';
import { Tr } from '@patternfly/react-table';

const RuleRow = ({
  children,
  targetVersion,
  sourceVersion,
  row: { item: { available_in_version } = {} },
  rowProps: _rowProps,
  ...props
}) => (
  <Tr
    {...props}
    style={{
      ...(available_in_version &&
      !available_in_version.includes(targetVersion.ssg_version) &&
      available_in_version.includes(sourceVersion.ssg_version)
        ? {
            backgroundColor:
              'var(--pf-t--global--background--color--secondary--default)',
          }
        : {}),
      ...(available_in_version &&
      available_in_version?.includes(targetVersion.ssg_version) &&
      !available_in_version?.includes(sourceVersion.ssg_version)
        ? {
            backgroundColor:
              'var(--pf-t--global--color--nonstatus--blue--default)',
          }
        : {}),
    }}
  >
    {children}
  </Tr>
);

RuleRow.propTypes = {
  children: propTypes.node,
  sourceVersion: propTypes.object,
  targetVersion: propTypes.object,
  row: propTypes.object,
  rowProps: propTypes.object,
};

export default RuleRow;
