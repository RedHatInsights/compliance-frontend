import React from 'react';
import propTypes from 'prop-types';
import {
    Button,
    GridItem
} from '@patternfly/react-core';
import { ComplianceEmptyState } from '@redhat-cloud-services/frontend-components-inventory-compliance';
import { BackgroundLink, ReportCard } from 'PresentationalComponents';

const EmptyState = () => (
    <ComplianceEmptyState
        title={ 'No policies are reporting' }
        mainButton={ <BackgroundLink to='/scappolicies/new'>
            <Button variant='primary'>Create new policy</Button>
        </BackgroundLink> }
    />
);

const ReportCardGrid = ({ profiles }) => (
    profiles && profiles.length > 0 ?
        profiles.map((profile, i) => (
            <GridItem sm={12} md={12} lg={6} xl={4} key={i}>
                <ReportCard
                    key={ `profile-report-card-${i}`}
                    profile={ profile }
                />
            </GridItem>
        )) : <EmptyState />
);

ReportCardGrid.propTypes = {
    profiles: propTypes.array
};

export default ReportCardGrid;
