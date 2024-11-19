import React from 'react';
import {
  LinkButton,
  LinkWithPermission as Link,
} from 'PresentationalComponents';

const CreateLink = () => (
  <Link
    to="/scappolicies/new"
    Component={LinkButton}
    componentProps={{
      variant: 'primary',
      ouiaId: 'CreateNewPolicyButton',
    }}
  >
    Create new policy
  </Link>
);

export default CreateLink;
