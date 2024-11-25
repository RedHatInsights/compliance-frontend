import React from 'react';
import propTypes from 'prop-types';
import {
  LinkWithPermission as Link,
  LinkButton,
} from 'PresentationalComponents';
import { Button, ToolbarItem, Tooltip } from '@patternfly/react-core';
import useAnchor from 'Utilities/hooks/useAnchor';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';

const EditSystemsButtonToolbarItem = ({ policy }) => {
  const hash = useAnchor();
  const apiV2Enabled = useAPIV2FeatureFlag();

  return (
    <ToolbarItem>
      {apiV2Enabled ? (
        <Tooltip content="Switch to the stable version to access this functionality">
          <Button isAriaDisabled>Edit systems</Button>
        </Tooltip>
      ) : (
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
      )}
    </ToolbarItem>
  );
};

EditSystemsButtonToolbarItem.propTypes = {
  policy: propTypes.object.isRequired,
};

export default EditSystemsButtonToolbarItem;
