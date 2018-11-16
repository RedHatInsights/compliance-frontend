import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import ComplianceSystemsTable from '../ComplianceSystemsTable/ComplianceSystemsTable';

const ComplianceSystems = () => {
    return (
        <React.Fragment>
            <Grid gutter={'sm'}>
                <GridItem span={12}>
                    <ComplianceSystemsTable />
                </GridItem>
            </Grid>
        </React.Fragment>
    );
};

export default ComplianceSystems;
