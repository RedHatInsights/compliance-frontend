import React from 'react';
import propTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { usePermissions } from '@redhat-cloud-services/frontend-components-utilities/RBACHook';
import { findRouteByPath } from '@/Routes';
import useFeature from 'Utilities/hooks/useFeature';

const NoOp = ({ children }) => children;
NoOp.propTypes = {
  children: propTypes.node,
};

export const LinkWithRBAC = ({ to, children, ...linkProps }) => {
  const route = findRouteByPath(to);
  const { hasAccess, isLoading } = usePermissions(
    'compliance',
    route?.requiredPermissions,
    true,
    true
  );
  const hasPermission = !isLoading && hasAccess;
  const TooltipOrDiv = !hasPermission ? Tooltip : NoOp;

  return (
    <TooltipOrDiv
      content={<div>You do not have permissions to perform this action</div>}
    >
      <Link to={to} {...linkProps} isDisabled={!hasPermission}>
        {children}
      </Link>
    </TooltipOrDiv>
  );
};

LinkWithRBAC.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.node,
};

const LinkWithPermission = (props) => {
  const rbacEnabled = useFeature('rbac');
  const Component = rbacEnabled ? LinkWithRBAC : Link;

  return <Component {...props} />;
};

export default LinkWithPermission;
