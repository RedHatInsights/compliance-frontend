import React from 'react';
import propTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import Link from '@redhat-cloud-services/frontend-components/InsightsLink';
import useRoutePermissions from 'Utilities/hooks/useRoutePermissions';

const NoOp = ({ children }) => children;
NoOp.propTypes = {
  children: propTypes.node,
};

export const LinkWithPermission = ({
  to,
  children,
  Component,
  componentProps = {},
  ...linkProps
}) => {
  const ComponentToRender = Component || Link;
  const { hasAccess, isLoading } = useRoutePermissions(to);
  const hasPermission = !isLoading && hasAccess;
  const TooltipOrDiv = !hasPermission ? Tooltip : NoOp;

  return (
    <TooltipOrDiv
      content={<div>You do not have permissions to perform this action</div>}
    >
      <ComponentToRender
        app="compliance"
        to={to}
        {...componentProps}
        {...linkProps}
        isDisabled={!hasPermission}
      >
        {children}
      </ComponentToRender>
    </TooltipOrDiv>
  );
};

LinkWithPermission.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.node,
  Component: propTypes.node,
  componentProps: propTypes.object,
};

export default LinkWithPermission;
