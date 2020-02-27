import React from 'react';
import {
    PageHeader,
    PageHeaderTitle,
    Main
} from '@redhat-cloud-services/frontend-components';
import {
    Grid
} from '@patternfly/react-core';
import {
    LoadingComplianceCards
} from 'PresentationalComponents';

export const LoadingState = () => (
    <React.Fragment>
        <PageHeader>
            <PageHeaderTitle title="Compliance" />
        </PageHeader>
        <Main>
            <div className="policies-donuts">
                <Grid gutter='md'>
                    <LoadingComplianceCards/>
                </Grid>
            </div>
        </Main>
    </React.Fragment>
);

export default LoadingState;
