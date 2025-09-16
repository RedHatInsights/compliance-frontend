import React from 'react';
import propTypes from 'prop-types';
import { NotConnected } from '@redhat-cloud-services/frontend-components/NotConnected';
import NoPoliciesState from './NoPoliciesState';
import NoReportsState from './NoReportsState';
import useSystem from 'Utilities/hooks/api/useSystem';
import { Bullseye, Spinner } from '@patternfly/react-core';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';

const EmptyState = ({ inventoryId: systemId, system, connectedToInsights }) => {
  const isLightspeedEnabled = useFeatureFlag('platform.lightspeed-rebrand');
  // request system data in case Inventory details Compliance opened
  const { data: { data } = {}, loading: systemLoading } = useSystem({
    params: { systemId },
    skip: !system && connectedToInsights === false,
  });

  const policiesCount = system?.policies.length ?? data?.policies.length;

  if (connectedToInsights === false) {
    return (
      <NotConnected
        titleText={`This system isn’t connected to ${isLightspeedEnabled ? 'Red Hat Lightspeed' : 'Insights'} yet`}
      />
    );
  }

  if (systemLoading === true) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
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
  connectedToInsights: propTypes.bool,
};

export default EmptyState;
