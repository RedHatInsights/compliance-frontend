import React from 'react';
import propTypes from 'prop-types';
import {
  EmptyState as PfEmptyState,
  EmptyStateBody,
} from '@patternfly/react-core';
import { DisconnectedIcon } from '@patternfly/react-icons';
import { NotConnected } from '@redhat-cloud-services/frontend-components/NotConnected';
import NoPoliciesState from './NoPoliciesState';
import NoReportsState from './NoReportsState';
import useSystem from 'Utilities/hooks/api/useSystem';
import { CenteredSpinner } from 'PresentationalComponents';
import { getTerm } from '@/Utilities/helpers';
import { getAppConfig } from '@/config/appConfig';

const EmptyState = ({ inventoryId: systemId, system, connectedToInsights }) => {
  const insightsTerm = getAppConfig().features.terms.insights;
  // request system data in case Inventory details Compliance opened
  const { data: { data } = {}, loading: systemLoading } = useSystem({
    params: { systemId },
    skip: !system && connectedToInsights === false,
  });

  const policiesCount = system?.policies.length ?? data?.policies.length;

  if (connectedToInsights === false) {
    const titleText = `This ${getTerm('system', { lowercase: true })} isn’t connected to ${insightsTerm} yet`;

    if (!getAppConfig().features.showLinkToDocs) {
      return (
        <PfEmptyState
          headingLevel="h5"
          icon={DisconnectedIcon}
          titleText={titleText}
        >
          <EmptyStateBody>
            To get started, activate the Insights client for this{' '}
            {getTerm('system', { lowercase: true })}.
          </EmptyStateBody>
        </PfEmptyState>
      );
    }

    return <NotConnected titleText={titleText} />;
  }

  if (systemLoading === true) {
    return <CenteredSpinner />;
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
