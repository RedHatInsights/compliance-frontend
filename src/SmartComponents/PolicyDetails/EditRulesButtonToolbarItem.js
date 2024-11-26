import React from 'react';
import propTypes from 'prop-types';
import { Button, ToolbarItem, Tooltip } from '@patternfly/react-core';
import {
  LinkWithPermission as Link,
  LinkButton,
} from 'PresentationalComponents';
import useAnchor from 'Utilities/hooks/useAnchor';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';

const EditRulesButtonToolbarItem = ({ policy }) => {
  let hash = useAnchor();
  const apiV2Enabled = useAPIV2FeatureFlag();

  return (
    <ToolbarItem>
      {apiV2Enabled ? (
        <Tooltip content="Switch to the stable version to access this functionality">
          <Button isAriaDisabled>Edit rules</Button>
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
            ouiaId: 'EditRulesButton',
          }}
        >
          Edit rules
        </Link>
      )}
    </ToolbarItem>
  );
};

EditRulesButtonToolbarItem.propTypes = {
  policy: propTypes.object.isRequired,
};

export default EditRulesButtonToolbarItem;
