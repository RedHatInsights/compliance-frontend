// with REST API implementation
import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import SystemPolicyCardPresentational from 'PresentationalComponents/SystemPolicyCard';
import dataSerialiser from 'Utilities/dataSerialiser';
import { dataMap } from './constants';
import propTypes from 'prop-types';

export const SystemPolicyCards = ({ testResults }) => (
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

SystemPolicyCards.propTypes = {
  testResults: propTypes.array.isRequired,
};

export default SystemPolicyCards;
