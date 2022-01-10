import React from 'react';
import { BackgroundLink } from 'PresentationalComponents';
import { PlusCircleIcon } from '@patternfly/react-icons';
import {
  Title,
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStatePrimary,
  EmptyStateSecondaryActions,
  EmptyStateIcon,
} from '@patternfly/react-core';

const NoPoliciesState = () => (
  <Bullseye>
    <EmptyState>
      <EmptyStateIcon icon={PlusCircleIcon} />
      <Title headingLevel="h1" size="lg">
        This system is not part of any SCAP policies defined within Compliance.
      </Title>
      <EmptyStateBody>
        To assess and monitor compliance against a SCAP policy for this system,
        add it to an existing policy or create a new policy.
      </EmptyStateBody>
      <EmptyStatePrimary>
        <BackgroundLink to="/scappolicies/new">
          <Button variant="primary" ouiaId="CreateNewPolicyButton">
            Create new policy
          </Button>
        </BackgroundLink>
      </EmptyStatePrimary>
      <EmptyStateSecondaryActions>
        <Button
          variant="link"
          component="a"
          href="/insights/compliance/scappolicies"
        >
          View compliance policies
        </Button>
      </EmptyStateSecondaryActions>
    </EmptyState>
  </Bullseye>
);

export default NoPoliciesState;
