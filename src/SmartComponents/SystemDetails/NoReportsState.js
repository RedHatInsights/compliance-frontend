import React from 'react';
import propTypes from 'prop-types';
import { CloudSecurityIcon } from '@patternfly/react-icons';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateHeader,
} from '@patternfly/react-core';

const NoReportsState = ({ system }) => (
  <Bullseye>
    <EmptyState
      style={{
        '--pf-v5-c-empty-state__icon--FontSize':
          'var(--pf-v5-c-empty-state--m-xl__icon--FontSize)',
      }}
    >
      <EmptyStateHeader
        titleText="No results reported"
        icon={
          <EmptyStateIcon
            icon={CloudSecurityIcon}
            style={{
              fontWeight: '500',
              color: 'var(--pf-v5-global--primary-color--100)',
            }}
          />
        }
        headingLevel="h1"
      />
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
);

NoReportsState.propTypes = {
  system: propTypes.shape({
    policies: propTypes.array,
  }),
};

export default NoReportsState;
