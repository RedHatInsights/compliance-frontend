import React from 'react';
import propTypes from 'prop-types';
import { Tooltip } from '@patternfly/react-core';
import Link from '@redhat-cloud-services/frontend-components/InsightsLink';
import useRoutePermissions from 'Utilities/hooks/useRoutePermissions';

const NoOp = ({ children }) => children;
NoOp.propTypes = {
  children: propTypes.node,
};

/**
 * Component to render a InsightsLink if required permissions are met or render a disabled link with tooltip if not.
 *
 *  @param   {object}             props                  Component props
 *  @param   {string | object}    props.to               ReactRouter to prop, which will be used to determine the required permissions for this path
 *  @param   {React.ReactElement} [props.Component]      Alternative "Link" component to render
 *  @param   {object}             [props.componentProps] Additional props for the Link component
 *  @param   {React.ReactElement} props.children         Component children
 *
 *  @returns {React.ReactElement}                        Component
 *
 *  @category Compliance
 *  @subcategory Components
 *
 */
const LinkWithPermission = ({
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
  Component: propTypes.oneOfType([propTypes.func, propTypes.node]),
  componentProps: propTypes.object,
};

export default LinkWithPermission;
