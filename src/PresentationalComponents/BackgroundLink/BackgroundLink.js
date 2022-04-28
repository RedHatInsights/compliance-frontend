import React from 'react';
import propTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { LinkWithPermission } from 'PresentationalComponents';

const BackgroundLink = ({
  to,
  hash,
  children,
  state: desiredState,
  backgroundLocation,
  checkPermissions = true,
  ...props
}) => {
  const currentLocation = useLocation();
  const background = { ...currentLocation, ...backgroundLocation };
  const state = { ...desiredState, background };
  const LinkComponent = checkPermissions ? LinkWithPermission : Link;

  return (
    <LinkComponent to={{ pathname: to, state, hash }} {...props}>
      {children}
    </LinkComponent>
  );
};

BackgroundLink.propTypes = {
  backgroundLocation: propTypes.object,
  children: propTypes.node,
  hash: propTypes.string,
  state: propTypes.object,
  to: propTypes.string.isRequired,
  checkPermissions: propTypes.bool,
};

export default BackgroundLink;
