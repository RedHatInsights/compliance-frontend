import React from 'react';
import propTypes from 'prop-types';
import { BackgroundLink, LinkButton } from 'PresentationalComponents';
import { ToolbarItem } from '@patternfly/react-core';

const EditSystemsButtonToolbarItem = ({
  to,
  state,
  hash,
  backgroundLocation,
  variant,
  ouiaId,
}) => {
  return (
    <ToolbarItem>
      <BackgroundLink
        to={to}
        state={state}
        hash={hash}
        backgroundLocation={backgroundLocation}
        variant={variant}
        ouiaId={ouiaId}
        component={LinkButton}
      >
        Edit systems
      </BackgroundLink>
    </ToolbarItem>
  );
};
EditSystemsButtonToolbarItem.propTypes = {
  to: propTypes.string.required,
  state: propTypes.object,
  hash: propTypes.object,
  backgroundLocation: propTypes.object,
  variant: propTypes.string.required,
  ouiaId: propTypes.string.required,
};

export default EditSystemsButtonToolbarItem;
