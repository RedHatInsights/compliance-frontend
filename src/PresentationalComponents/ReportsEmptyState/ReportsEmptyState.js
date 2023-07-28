import React from 'react';
import ComplianceEmptyState from '../ComplianceEmptyState';
import { BackgroundLink, LinkButton } from 'PresentationalComponents';

const ReportsEmptyState = () => (
  <ComplianceEmptyState
    title={'No policies are reporting'}
    mainButton={
      <BackgroundLink
        to="/scappolicies/new"
        Component={LinkButton}
        componentProps={{
          variant: 'primary',
          ouiaId: 'CreateNewPolicyButton',
        }}
      >
        Create new policy
      </BackgroundLink>
    }
  />
);

export default ReportsEmptyState;
