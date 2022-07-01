import React from 'react';
import { Button } from '@patternfly/react-core';
import ComplianceEmptyState from '../ComplianceEmptyState';
import { BackgroundLink } from 'PresentationalComponents';

const ReportsEmptyState = () => (
  <ComplianceEmptyState
    title={'No policies are reporting'}
    mainButton={
      <BackgroundLink
        to="/scappolicies/new"
        component={Button}
        variant="primary"
        ouiaId="CreateNewPolicyButton"
      >
        Create new policy
      </BackgroundLink>
    }
  />
);

export default ReportsEmptyState;
