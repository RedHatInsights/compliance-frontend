import React from 'react';
import propTypes from 'prop-types';
import { ToolbarItem } from '@patternfly/react-core';
import { BackgroundLink, LinkButton } from 'PresentationalComponents';
import useAnchor from 'Utilities/hooks/useAnchor';

const EditRulesButtonToolbarItem = ({ policy }) => {
  let anchor = useAnchor();

  return (
    <ToolbarItem>
      <BackgroundLink
        to={`/scappolicies/${policy.id}/edit`}
        hash={anchor}
        backgroundLocation={{ hash: anchor }}
        Component={LinkButton}
        componentProps={{
          variant: 'primary',
          ouiaId: 'EditRulesButton',
        }}
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
