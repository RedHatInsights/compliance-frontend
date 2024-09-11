import React from 'react';
import propTypes from 'prop-types';
import { usePermissionsWithContext } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components/NotAuthorized';

/**
 * Wrapper component to either render a component if required permissions are met,
 * Show the `NotAuthorized` page, or do not render the component at all
 *
 *  @param   {object}             props                     Component props
 *  @param   {React.ReactElement} props.children            Component to render
 *  @param   {Array}              props.requiredPermissions An array of RBAC permissions required to render the component
 *  @param   {boolean}            props.hide                Boolean to set wether or not to hide the component if required permissions are NOT met
 *
 *  @returns {React.ReactElement}                           Returns the component for this route
 *
 *  @category    Compliance
 *  @subcategory Components
 *
 */
const WithPermission = ({
  children,
  requiredPermissions = [],
  hide = false,
}) => {
  const { hasAccess, isLoading } = usePermissionsWithContext(
    requiredPermissions,
    false,
    false
  );

  if (!isLoading) {
    return hasAccess
      ? children
      : !hide && <NotAuthorized serviceName="Compliance" />;
  } else {
    return '';
  }
};

WithPermission.propTypes = {
  children: propTypes.node,
  requiredPermissions: propTypes.array,
  hide: propTypes.bool,
};

export default WithPermission;
