import React from 'react';
import { Grid, GridItem } from '@patternfly/react-core';
import SystemPolicyCard from './SystemPolicyCard';
import propTypes from 'prop-types';

const SystemPolicyCards = ({
  policies = [],
  selectedPolicies,
  onCardClick,
}) => {
  const filteredPolicies = policies.filter(
    (policy) => policy.rulesFailed + policy.rulesPassed > 0
  );

  return (
    <Grid hasGutter>
      {filteredPolicies.map((policy, i) => (
        <GridItem sm={12} md={12} lg={6} xl={4} key={i}>
          <SystemPolicyCard
            policy={policy}
            style={{ height: '100%' }}
            onClick={(policy) => onCardClick(policy)}
            isSelected={selectedPolicies?.find(
              (policyId) => policyId === policy.id
            )}
          />
        </GridItem>
      ))}
    </Grid>
  );
};

SystemPolicyCards.propTypes = {
  policies: propTypes.array,
  onCardClick: propTypes.func,
  selectedPolicies: propTypes.string,
};

export default SystemPolicyCards;
