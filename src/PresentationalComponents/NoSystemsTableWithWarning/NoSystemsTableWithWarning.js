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

const NoSystemsTableWithWarning = () => (
  <Bullseye>
    <EmptyState
      headingLevel="h2"
      titleText="No systems on this policy"
      variant={EmptyStateVariant.full}
    >
      <EmptyStateBody>
        <Content>
          <Content component={ContentVariants.p}>
            Add systems to this policy from the systems page
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

export default NoSystemsTableWithWarning;
