import React from 'react';
import propTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import Link from '@redhat-cloud-services/frontend-components/InsightsLink';
import { findRouteByPath } from '@/Routes';
import useFeatureFlag from 'Utilities/hooks/useFeatureFlag';
import {
  useRbacV1Permissions,
  useKesselPermissions,
} from 'Utilities/hooks/usePermissionCheck';

const NoOp = ({ children }) => children;
NoOp.propTypes = { children: propTypes.node };

const LinkContent = ({
  to,
  children,
  Component,
  componentProps,
  linkProps,
  hasAccess,
  isLoading,
}) => {
  const ComponentToRender = Component || Link;
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

LinkContent.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.node,
  Component: propTypes.oneOfType([propTypes.func, propTypes.node]),
  componentProps: propTypes.object,
  linkProps: propTypes.object,
  hasAccess: propTypes.bool,
  isLoading: propTypes.bool,
};

const LinkWithRbacV1Permission = ({
  to,
  children,
  Component,
  componentProps = {},
  ...linkProps
}) => {
  const route = findRouteByPath(to);
  const requiredPermissions = route?.requiredPermissions || [];
  const { hasAccess, isLoading } = useRbacV1Permissions(requiredPermissions);

  return (
    <LinkContent
      to={to}
      Component={Component}
      componentProps={componentProps}
      linkProps={linkProps}
      hasAccess={hasAccess}
      isLoading={isLoading}
    >
      {children}
    </LinkContent>
  );
};

LinkWithRbacV1Permission.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.node,
  Component: propTypes.oneOfType([propTypes.func, propTypes.node]),
  componentProps: propTypes.object,
};

const LinkWithKesselPermission = ({
  to,
  children,
  Component,
  componentProps = {},
  ...linkProps
}) => {
  const route = findRouteByPath(to);
  const requiredPermissions = route?.requiredPermissions || [];
  const { hasAccess, isLoading } = useKesselPermissions(requiredPermissions);

  return (
    <LinkContent
      to={to}
      Component={Component}
      componentProps={componentProps}
      linkProps={linkProps}
      hasAccess={hasAccess}
      isLoading={isLoading}
    >
      {children}
    </LinkContent>
  );
};

LinkWithKesselPermission.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.node,
  Component: propTypes.oneOfType([propTypes.func, propTypes.node]),
  componentProps: propTypes.object,
};

const LinkWithPermission = (props) => {
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');

  return isKesselEnabled ? (
    <LinkWithKesselPermission {...props} />
  ) : (
    <LinkWithRbacV1Permission {...props} />
  );
};

LinkWithPermission.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.node,
  Component: propTypes.oneOfType([propTypes.func, propTypes.node]),
  componentProps: propTypes.object,
};

export default LinkWithPermission;
