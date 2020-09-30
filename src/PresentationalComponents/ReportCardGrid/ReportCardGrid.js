import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import { ReportCard } from 'PresentationalComponents';

const ReportCardGrid = ({ profiles }) => (
    <Grid hasGutter>
        { profiles.map((profile, i) => (
            <GridItem sm={12} md={12} lg={6} xl={4} key={i}>
                <ReportCard
                    key={ `profile-report-card-${i}`}
                    profile={ profile }
                />
            </GridItem>)) }
    </Grid>
);

ReportCardGrid.propTypes = {
    profiles: propTypes.array
};

export default ReportCardGrid;
