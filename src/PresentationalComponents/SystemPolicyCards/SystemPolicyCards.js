import React from 'react';
import propTypes from 'prop-types';
import { Grid, GridItem } from '@patternfly/react-core';
import SystemPolicyCard from '../SystemPolicyCard';
import LoadingPolicyCards from './components/LoadingPolicyCards';

const SystemPolicyCards = ({ policies = [], loading }) => {
  const policiesToShow = policies.filter(
    (policy) => policy.rulesFailed + policy.rulesPassed > 0
  );

  return (
    <Grid hasGutter>
      {loading ? (
        <LoadingPolicyCards />
      ) : (
        policiesToShow.map((policy, i) => (
          <GridItem sm={12} md={12} lg={6} xl={4} key={i}>
            <SystemPolicyCard policy={policy} />
          </GridItem>
        ))
      )}
    </Grid>
  );
};

SystemPolicyCards.propTypes = {
  policies: propTypes.array,
  loading: propTypes.bool,
};

export default SystemPolicyCards;
