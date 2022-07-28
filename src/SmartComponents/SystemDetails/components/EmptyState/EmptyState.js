import React from 'react';
import propTypes from 'prop-types';
import { NotConnected } from '@redhat-cloud-services/frontend-components/NotConnected';
import NoPoliciesState from './NoPoliciesState';
import NoReportsState from './NoReportsState';

const EmptyState = ({ system }) => {
  if (!system?.insightsId) {
    return <NotConnected />;
  } else {
    if (!system?.hasPolicy) {
      return <NoPoliciesState system={system} />;
    } else if (system?.hasPolicy && system?.testResultProfiles?.length === 0) {
      return <NoReportsState system={system} />;
    }
  }
};

EmptyState.propTypes = {
  system: propTypes.object,
};

export default EmptyState;
