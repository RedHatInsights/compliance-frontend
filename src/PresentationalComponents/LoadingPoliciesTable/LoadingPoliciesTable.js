import React from 'react';
import columns from '../PoliciesTable/Columns';
import { SkeletonTable } from '@patternfly/react-component-groups';

const LoadingPoliciesTable = () => (
  <SkeletonTable
    aria-label="Policies loading"
    ouiaId="PoliciesTable"
    rowSize={10}
    columns={columns.map(({ title }) => title)}
  />
);

export default LoadingPoliciesTable;
