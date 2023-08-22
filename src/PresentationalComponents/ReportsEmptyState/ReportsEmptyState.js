import React from 'react';
import ComplianceEmptyState from '../ComplianceEmptyState';
import {
  LinkWithPermission as Link,
  LinkButton,
} from 'PresentationalComponents';

const ReportsEmptyState = () => (
  <ComplianceEmptyState
    title={'No policies are reporting'}
    mainButton={
      <Link
        to="/scappolicies/new"
        Component={LinkButton}
        componentProps={{
          variant: 'primary',
          ouiaId: 'CreateNewPolicyButton',
        }}
      >
        Create new policy
      </Link>
    }
  />
);

export default ReportsEmptyState;
