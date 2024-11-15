// with REST API implementation
import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import SystemPolicyCardPresentational from 'PresentationalComponents/SystemPolicyCard';
import dataSerialiser from 'Utilities/dataSerialiser';
import { dataMap } from './constants';
import propTypes from 'prop-types';

export const SystemPolicyCards = ({ reportTestResults }) => (
  <Grid hasGutter>
    {reportTestResults.map((testResult) => (
      <GridItem sm={12} md={12} lg={6} xl={4} key={testResult.report_id}>
        <SystemPolicyCardPresentational
          policy={dataSerialiser({ ...testResult }, dataMap)}
          style={{ height: '100%' }}
        />
      </GridItem>
    ))}
  </Grid>
);

SystemPolicyCards.propTypes = {
  reportTestResults: propTypes.array.isRequired,
};

export default SystemPolicyCards;
