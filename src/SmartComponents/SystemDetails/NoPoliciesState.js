import React from 'react';
import { BackgroundLink, LinkButton } from 'PresentationalComponents';
import { PlusCircleIcon } from '@patternfly/react-icons';
import {
  Title,
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStatePrimary,
  EmptyStateSecondaryActions,
  EmptyStateIcon,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';

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
        <BackgroundLink
          to="/scappolicies/new"
          variant="primary"
          ouiaId="CreateNewPolicyButton"
          component={LinkButton}
        >
          Create new policy
        </BackgroundLink>
      </EmptyStatePrimary>
      <EmptyStateSecondaryActions>
        <Link variant="plain" to="/scappolicies">
          View compliance policies
        </Link>
      </EmptyStateSecondaryActions>
    </EmptyState>
  </Bullseye>
);

export default NoPoliciesState;
