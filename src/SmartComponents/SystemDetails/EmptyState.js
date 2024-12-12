import React from 'react';
import propTypes from 'prop-types';
import { NotConnected } from '@redhat-cloud-services/frontend-components/NotConnected';
import NoPoliciesState from './NoPoliciesState';
import NoReportsState from './NoReportsState';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import useSystem from 'Utilities/hooks/api/useSystem';
import { Bullseye, Spinner } from '@patternfly/react-core';

const EmptyState = ({ insightsId, policiesCount }) => {
  const location = useLocation();
  const isInventoryInPath = location.pathname.includes('inventory');
  const { inventoryId } = useParams();
  console.log(`DEBUG insightsId ${!isInventoryInPath || !!insightsId}`)
  const { data: { data } = {} } = useSystem({
    params: [inventoryId],
    skip: !isInventoryInPath || !!insightsId,
  });

  const effectiveInsightsId = data?.insights_id || insightsId;
  const effectivePoliciesCount = data?.policies.length || policiesCount;

  if (isInventoryInPath && !data) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!effectiveInsightsId) {
    return <NotConnected />;
  }

  if (policiesCount === 0) {
    return <NoPoliciesState />;
  } else {
    return <NoReportsState policiesCount={effectivePoliciesCount} />;
  }
};

EmptyState.propTypes = {
  insightsId: propTypes.string,
  policiesCount: propTypes.number,
};

export default EmptyState;
