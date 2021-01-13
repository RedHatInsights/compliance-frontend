import React from 'react';
import { Button } from '@patternfly/react-core';
import { ComplianceEmptyState } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { BackgroundLink } from 'PresentationalComponents';

const ReportsEmptyState = () => (
    <ComplianceEmptyState
        title={ 'No policies are reporting' }
        mainButton={ <BackgroundLink to='/scappolicies/new'>
            <Button variant='primary' ouiaId="newPolicy">Create new policy</Button>
        </BackgroundLink> }
    />
);

export default ReportsEmptyState;
