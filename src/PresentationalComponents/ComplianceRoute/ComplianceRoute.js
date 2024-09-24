import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useLocation, matchPath } from 'react-router-dom';
import { WithPermission } from 'PresentationalComponents';
import useDocumentTitle from 'Utilities/hooks/useDocumentTitle';

/**
 * This is component renders "routes" in Routes.js
 *
 *  @param   {object}             props                     Component props
 *  @param   {React.ReactElement} props.component           Component to render
 *  @param   {string}             props.title               Title to set as browser title
 *  @param   {string}             props.path                Path of the route
 *  @param   {Array}              props.requiredPermissions An array of RBAC permissions required to render the component
 *  @param   {object}             props.props               Props for the component to render
 *
 *  @returns {React.ReactElement}                           Returns the component for this route
 *
 *  @category    Compliance
 *  @subcategory Components
 *
 */
const ComplianceRoute = (props) => {
  const {
    component: Component,
    path,
    props: propsProp,
    title,
    requiredPermissions,
  } = props;
  const location = useLocation();
  const setTitle = useDocumentTitle();
  const isCurrent = !!matchPath({ path, end: true }, location.pathname);

  const requiresTitleEntity = title.includes('$entityTitle');
  const componentProps = {
    ...propsProp,
    route: { ...props, isCurrent, setTitle },
  };

  useEffect(() => {
    isCurrent && !requiresTitleEntity && setTitle(title);
  }, []);

  return requiredPermissions ? (
    <WithPermission requiredPermissions={requiredPermissions}>
      <Component {...componentProps} />
    </WithPermission>
  ) : (
    <Component {...componentProps} />
  );
};

ComplianceRoute.propTypes = {
  component: propTypes.node,
  modal: propTypes.bool,
  path: propTypes.string,
  props: propTypes.object,
  title: propTypes.string,
  requiredPermissions: propTypes.array,
};

export default ComplianceRoute;
