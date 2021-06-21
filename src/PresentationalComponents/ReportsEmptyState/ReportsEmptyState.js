import React from 'react';
import { Button } from '@patternfly/react-core';
import ComplianceEmptyState from '../ComplianceEmptyState';
import { BackgroundLink } from 'PresentationalComponents';

const ReportsEmptyState = () => (
    <ComplianceEmptyState
        title={ 'No policies are reporting' }
        mainButton={ <BackgroundLink to='/scappolicies/new'>
            <Button variant='primary' ouiaId="CreateNewPolicyButton">Create new policy</Button>
        </BackgroundLink> }
    />
);

export default ReportsEmptyState;
