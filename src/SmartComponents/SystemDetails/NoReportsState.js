import React from 'react';
import propTypes from 'prop-types';
import { CloudSecurityIcon } from '@patternfly/react-icons';
import { Bullseye, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import { pluralize } from '@patternfly/react-core';

const NoReportsState = ({ policiesCount }) => {
  const bodyTextMain = `This system is part of ${pluralize(policiesCount, 'policy', 'policies')}, but has not returned any results.`;
  const bodyTextSub = `Reports are returned after scanning the system using the 'insights-client --compliance' command.`;
  return (
    <Bullseye>
      <EmptyState
        headingLevel="h1"
        icon={CloudSecurityIcon}
        titleText="No results reported"
        style={{
          '--pf-v5-c-empty-state__icon--FontSize':
            'var(--pf-v5-c-empty-state--m-xl__icon--FontSize)',
        }}
      >
        <EmptyStateBody>{bodyTextMain}</EmptyStateBody>
        <EmptyStateBody>{bodyTextSub}</EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};

NoReportsState.propTypes = {
  policiesCount: propTypes.number,
};

export default NoReportsState;
