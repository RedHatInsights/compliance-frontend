import React from 'react';
import {
    Card,
    Grid,
    GridItem
} from '@patternfly/react-core';
import ContentLoader from 'react-content-loader';
import _ from 'lodash';

const LoadingComplianceCards = () => (
    <Grid hasGutter>
        { _.range(3).map((_, key) => {
            return <GridItem sm={12} md={12} lg={6} xl={4} key={key}>
                <Card>
                    <ContentLoader height={400} width={400} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
                        <rect x="6" y="31" rx="4" ry="4" width="293" height="15" />
                        <rect x="8" y="15" rx="3" ry="3" width="85" height="6" />
                        <rect x="7" y="112" rx="3" ry="3" width="220" height="10" />
                        <circle cx="190" cy="256" r="109" />
                        <rect x="8" y="73" rx="0" ry="0" width="69" height="23" />
                        <rect x="47" y="77" rx="0" ry="0" width="0" height="0" />
                        <rect x="36" y="77" rx="0" ry="0" width="16" height="0" />
                    </ContentLoader>
                </Card>
            </GridItem>;
        })}
    </Grid>
);

export default LoadingComplianceCards;
