import React from 'react';
import { useLocation } from 'react-router-dom';
import useNavigate from '@redhat-cloud-services/frontend-components-utilities/useInsightsNavigate';

import { Alert, AlertActionLink } from '@patternfly/react-core';

const NewRulesAlert = () => {
  const navigate = useNavigate();

  const location = useLocation();

  return (
    <Alert
      variant="info"
      isInline
      title="You selected a system that has a release version previously not included in this policy."
      actionLinks={
        <AlertActionLink
          onClick={() => navigate({ ...location, hash: '#rules' })}
        >
          Open rule editing
        </AlertActionLink>
      }
    >
      <p>
        If you have edited any rules for this policy, you will need to do so for
        this release version as well.
      </p>
    </Alert>
  );
};

export default NewRulesAlert;
