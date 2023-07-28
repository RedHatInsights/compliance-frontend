import React from 'react';
import propTypes from 'prop-types';
import { BackgroundLink, LinkButton } from 'PresentationalComponents';
import { ToolbarItem } from '@patternfly/react-core';
import useAnchor from 'Utilities/hooks/useAnchor';

const EditSystemsButtonToolbarItem = ({ policy }) => {
  const hash = useAnchor();

  return (
    <ToolbarItem>
      <BackgroundLink
        to={`/scappolicies/${policy.id}/edit`}
        hash={hash}
        backgroundLocation={{ hash: 'details' }}
        Component={LinkButton}
        componentProps={{
          variant: 'primary',
          ouiaId: 'EditSystemsButton',
        }}
      >
        Edit systems
      </BackgroundLink>
    </ToolbarItem>
  );
};

EditSystemsButtonToolbarItem.propTypes = {
  policy: propTypes.object.isRequired,
};

export default EditSystemsButtonToolbarItem;
