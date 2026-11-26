import React from 'react';
import {
  EmptyStateBody,
  EmptyState,
  EmptyStateVariant,
  Content,
  ContentVariants,
  Bullseye,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import { WARNING_TEXT } from 'PresentationalComponents';
import { getTerm } from '@/Utilities/helpers';

const NoSystemsTableWithWarning = () => {
  const systemTerm = getTerm('system', { plural: true, lowercase: true });
  return (
    <Bullseye>
      <EmptyState
        headingLevel="h2"
        titleText={`No ${systemTerm} on this policy`}
        variant={EmptyStateVariant.full}
      >
        <EmptyStateBody>
          <Content>
            <Content component={ContentVariants.p}>
              Add {systemTerm} to this policy in the Edit policy modal.
            </Content>
            <Content
              component="p"
              style={{
                color: 'var(--pf-t--global--color--status--warning--100)',
              }}
            >
              <ExclamationTriangleIcon /> {WARNING_TEXT}
            </Content>
          </Content>
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};

export default NoSystemsTableWithWarning;
