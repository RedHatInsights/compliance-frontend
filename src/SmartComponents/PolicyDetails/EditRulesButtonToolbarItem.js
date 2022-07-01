import React from 'react';
import propTypes from 'prop-types';
import { ToolbarItem } from '@patternfly/react-core';
import { BackgroundLink, LinkButton } from 'PresentationalComponents';
import { useAnchor } from 'Utilities/Router';

const EditRulesButtonToolbarItem = ({ policy }) => {
  let anchor = useAnchor();

  return (
    <ToolbarItem>
      <BackgroundLink
        to={`/scappolicies/${policy.id}/edit`}
        state={{ policy }}
        hash={anchor}
        backgroundLocation={{ hash: anchor }}
        variant="primary"
        ouiaId="EditRulesButton"
        component={LinkButton}
      >
        Edit rules
      </BackgroundLink>
    </ToolbarItem>
  );
};

EditRulesButtonToolbarItem.propTypes = {
  policy: propTypes.object.isRequired,
};

export default EditRulesButtonToolbarItem;
