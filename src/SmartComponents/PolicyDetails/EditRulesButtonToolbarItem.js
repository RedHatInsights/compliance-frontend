import React from 'react';
import propTypes from 'prop-types';
import { ToolbarItem } from '@patternfly/react-core';
import {
  LinkWithPermission as Link,
  LinkButton,
} from 'PresentationalComponents';
import useAnchor from 'Utilities/hooks/useAnchor';

const EditRulesButtonToolbarItem = ({ policy }) => {
  let hash = useAnchor();

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
          ouiaId: 'EditRulesButton',
        }}
      >
        Edit rules
      </Link>
    </ToolbarItem>
  );
};

EditRulesButtonToolbarItem.propTypes = {
  policy: propTypes.object.isRequired,
};

export default EditRulesButtonToolbarItem;
