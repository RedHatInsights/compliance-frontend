import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { useLocation, matchPath } from 'react-router-dom';
import { WithPermission } from 'PresentationalComponents';
import useDocumentTitle from 'Utilities/hooks/useDocumentTitle';

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
