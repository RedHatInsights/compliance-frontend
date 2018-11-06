import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import ComplianceProfilesTable from '../ComplianceProfilesTable/ComplianceProfilesTable';

const ComplianceProfiles = () => {
    return (
        <React.Fragment>
            <Grid gutter={'sm'}>
                <GridItem span={3}>
                    Main profile
                </GridItem>
                <GridItem span={9}>
                    Changes chart
                </GridItem>
                <GridItem span={12}>
                    <ComplianceProfilesTable />
                </GridItem>
            </Grid>
        </React.Fragment>
    );
};

export default ComplianceProfiles;
