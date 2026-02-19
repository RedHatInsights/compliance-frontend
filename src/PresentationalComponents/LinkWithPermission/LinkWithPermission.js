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
NoOp.propTypes = {
  children: propTypes.node,
};

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

const LinkWithResolvedPermission = ({
  to,
  children,
  Component,
  componentProps = {},
  hasAccess,
  isLoading,
  ...linkProps
}) => {
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

LinkWithResolvedPermission.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.node,
  Component: propTypes.oneOfType([propTypes.func, propTypes.node]),
  componentProps: propTypes.object,
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
  const requiredPermissions = route?.requiredPermissions ?? [];
  const { hasAccess, isLoading } = useRbacV1Permissions(requiredPermissions);

  return (
    <LinkWithResolvedPermission
      to={to}
      Component={Component}
      componentProps={componentProps}
      hasAccess={hasAccess}
      isLoading={isLoading}
      {...linkProps}
    >
      {children}
    </LinkWithResolvedPermission>
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
  const requiredPermissions = route?.requiredPermissions ?? [];
  const { hasAccess, isLoading } = useKesselPermissions(requiredPermissions);

  return (
    <LinkWithResolvedPermission
      to={to}
      Component={Component}
      componentProps={componentProps}
      hasAccess={hasAccess}
      isLoading={isLoading}
      {...linkProps}
    >
      {children}
    </LinkWithResolvedPermission>
  );
};

LinkWithKesselPermission.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  children: propTypes.node,
  Component: propTypes.oneOfType([propTypes.func, propTypes.node]),
  componentProps: propTypes.object,
};

/**
 * Renders a link when the user has the required permissions; otherwise renders the same link
 * disabled with a tooltip explaining lack of permission.
 *
 *  @param   {object}             props                  Component props
 *  @param   {string | object}    props.to               ReactRouter to prop, which will be used to determine the required permissions for this path
 *  @param   {React.ReactElement} props.children         Component children
 *  @param   {React.ReactElement} [props.Component]      Alternative "Link" component to render
 *  @param   {object}             [props.componentProps] Props passed to the link component
 *  @param   {boolean}            [props.hasAccess]      When passed with isLoading, permissions are not fetched; this value is used instead
 *  @param   {boolean}            [props.isLoading]      When passed with hasAccess, permissions are not fetched; this value is used instead
 *
 *  @returns {React.ReactElement}                        Component
 *
 *  @category Compliance
 *  @subcategory Components
 *
 */
const LinkWithPermission = (props) => {
  const isKesselEnabled = useFeatureFlag('compliance.kessel_enabled');
  const hasResolvedPermission =
    props.hasAccess !== undefined && props.isLoading !== undefined;

  if (isKesselEnabled && hasResolvedPermission) {
    return <LinkWithResolvedPermission {...props} />;
  }

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
  hasAccess: propTypes.bool,
  isLoading: propTypes.bool,
};

export default LinkWithPermission;
