import React from 'react';
import propTypes from 'prop-types';
import { CloudSecurityIcon } from '@patternfly/react-icons';
import {
  Title,
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
} from '@patternfly/react-core';

const NoReportsState = ({ system }) =>
  system?.hasPolicy && !system?.testResultProfiles?.length ? (
    <Bullseye>
      <EmptyState>
        <EmptyStateIcon
          icon={CloudSecurityIcon}
          title="Compliance"
          size="xl"
          style={{
            fontWeight: '500',
            color: 'var(--pf-global--primary-color--100)',
          }}
        />
        <Title headingLevel="h1" size="lg">
          No results reported
        </Title>
        <EmptyStateBody>
          This system is part of {system?.policies?.length}
          {system?.policies?.length > 1 ? ' policies' : ' policy'}, but has not
          returned any results.
        </EmptyStateBody>
        <EmptyStateBody>
          Reports are returned when the system checks into Insights. By default,
          systems check in every 24 hours.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  ) : (
    <></>
  );

NoReportsState.propTypes = {
  system: propTypes.shape({
    hasPolicy: propTypes.bool,
    testResultProfiles: propTypes.array,
    policies: propTypes.array,
  }),
};

export default NoReportsState;
