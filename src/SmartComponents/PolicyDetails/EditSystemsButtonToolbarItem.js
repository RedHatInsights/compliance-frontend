import React from 'react';
import propTypes from 'prop-types';
import {
  LinkWithPermission as Link,
  LinkButton,
} from 'PresentationalComponents';
import { ToolbarItem } from '@patternfly/react-core';
import useAnchor from 'Utilities/hooks/useAnchor';

const EditSystemsButtonToolbarItem = ({ policy }) => {
  const hash = useAnchor();

  return (
    <ToolbarItem>
      <Link
        to={{
          pathname: `/scappolicies/${policy.id}/edit`,
          hash,
        }}
        state={{ returnTo: { pathname: `/scappolicies/${policy.id}`, hash } }}
        Component={LinkButton}
        componentProps={{
          variant: 'primary',
          ouiaId: 'EditSystemsButton',
        }}
      >
        Edit systems
      </Link>
    </ToolbarItem>
  );
};

EditSystemsButtonToolbarItem.propTypes = {
  policy: propTypes.object.isRequired,
};

export default EditSystemsButtonToolbarItem;
