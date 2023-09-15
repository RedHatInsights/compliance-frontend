import React from 'react';
import { EmptyState, EmptyStateBody, Title } from '@patternfly/react-core';

const RulesTabEmptyState = () => (
  <EmptyState>
    <Title headingLevel="h5" size="lg">
      No rules can be configured
    </Title>
    <EmptyStateBody>
      This policy has no associated systems, and therefore no rules can be
      configured.
    </EmptyStateBody>
    <EmptyStateBody>
      Add at least one system to configure rules for this policy.
    </EmptyStateBody>
  </EmptyState>
);

export default RulesTabEmptyState;
