import React from 'react';
import propTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import { LinkButton } from 'PresentationalComponents';

const NoOp = ({ children }) => children;
NoOp.propTypes = { children: propTypes.node };

const CreateLink = ({ hasCreatePermission = true }) => {
  const TooltipOrDiv = !hasCreatePermission ? Tooltip : NoOp;

  return (
    <TooltipOrDiv
      content={<div>You do not have permissions to perform this action</div>}
    >
      <LinkButton
        to="/scappolicies/new"
        variant="primary"
        ouiaId="CreateNewPolicyButton"
        isDisabled={!hasCreatePermission}
      >
        Create new policy
      </LinkButton>
    </TooltipOrDiv>
  );
};

CreateLink.propTypes = {
  hasCreatePermission: propTypes.bool,
};

export default CreateLink;
