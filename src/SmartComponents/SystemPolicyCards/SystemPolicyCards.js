// with REST API implementation
import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import SystemPolicyCardPresentational from 'PresentationalComponents/SystemPolicyCard';
import dataSerialiser from 'Utilities/dataSerialiser';
import { dataMap } from './constants';

export const SystemPolicyCards = (testResults) => {
  // TODO: most probably, we would need to merge data from reports to properly show system policy cards (see dataMap)

  return (
    <Grid hasGutter>
      {testResults.map((policy) => (
        <GridItem sm={12} md={12} lg={6} xl={4} key={policy.id}>
          <SystemPolicyCardPresentational
            policy={dataSerialiser({ ...policy }, dataMap)}
            style={{ height: '100%' }}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

export default SystemPolicyCards;
