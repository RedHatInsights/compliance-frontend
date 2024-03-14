import React from 'react';
import {
  LinkButton,
  LinkWithPermission as Link,
} from 'PresentationalComponents';
import { PlusCircleIcon } from '@patternfly/react-icons';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateActions,
  EmptyStateHeader,
  EmptyStateFooter,
} from '@patternfly/react-core';

const NoPoliciesState = () => (
  <Bullseye>
    <EmptyState>
      <EmptyStateHeader
        titleText="This system is not part of any SCAP policies defined within Compliance."
        icon={<EmptyStateIcon icon={PlusCircleIcon} />}
        headingLevel="h1"
      />
      <EmptyStateBody>
        To assess and monitor compliance against a SCAP policy for this system,
        add it to an existing policy or create a new policy.
      </EmptyStateBody>
      <EmptyStateFooter>
        <EmptyStateActions>
          <Link
            to="/scappolicies/new"
            Component={LinkButton}
            componentProps={{
              variant: 'primary',
              ouiaId: 'CreateNewPolicyButton',
            }}
          >
            Create new policy
          </Link>
        </EmptyStateActions>
        <EmptyStateActions>
          <Link variant="plain" to="/scappolicies">
            View compliance policies
          </Link>
        </EmptyStateActions>
      </EmptyStateFooter>
    </EmptyState>
  </Bullseye>
);

export default NoPoliciesState;
