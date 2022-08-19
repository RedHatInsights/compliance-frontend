import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { Alert, AlertActionLink } from '@patternfly/react-core';

const NewRulesAlert = () => {
  const history = useHistory();
  const location = useLocation();

  return (
    <Alert
      variant="info"
      isInline
      title="You selected a system that has a release version previously not included in this policy."
      actionLinks={
        <AlertActionLink
          onClick={() => history.push({ ...location, hash: '#rules' })}
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
