import React from 'react';
import propTypes from 'prop-types';
import { NotConnected } from '@redhat-cloud-services/frontend-components/NotConnected';
import NoPoliciesState from './NoPoliciesState';
import NoReportsState from './NoReportsState';
import useSystem from 'Utilities/hooks/api/useSystem';
import { Bullseye, Spinner } from '@patternfly/react-core';

const EmptyState = ({ inventoryId, system }) => {
  // request system data in case Inventory details Compliance opened
  const { data: { data } = {} } = useSystem({
    params: [inventoryId],
    skip: system,
  });
  const policiesCount = system?.policies.length ?? data?.policies.length;
  const insightsId = system?.insights_id || data?.insights_id;

  if (!system && !data) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!insightsId) {
    return <NotConnected />;
  }

  if (policiesCount === 0) {
    return <NoPoliciesState />;
  } else {
    return <NoReportsState policiesCount={policiesCount} />;
  }
};

EmptyState.propTypes = {
  inventoryId: propTypes.string,
  system: propTypes.object,
};

export default EmptyState;
