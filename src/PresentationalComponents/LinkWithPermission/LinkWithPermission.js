import React from 'react';
import propTypes from 'prop-types';
import { findRouteByPath } from '@/Routes';
import { Link } from 'react-router-dom';
import { WithPermission } from 'PresentationalComponents';

const LinkWithPermission = ({ to, ...linkProps }) => {
  const route = findRouteByPath(to);

  return (
    <WithPermission requiredPermissions={route?.requiredPermissions} hide>
      <Link to={to} {...linkProps} />
    </WithPermission>
  );
};

LinkWithPermission.propTypes = {
  to: propTypes.object,
};

export default LinkWithPermission;
