import React from 'react';
import propTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { LinkWithPermission as Link } from 'PresentationalComponents';

const BackgroundLink = ({
  to,
  hash,
  children,
  state: desiredState,
  backgroundLocation,
  ...props
}) => {
  const currentLocation = useLocation();
  const background = { ...currentLocation, ...backgroundLocation };
  const state = { ...desiredState, background };

  return (
    <Link to={{ pathname: to, state, hash }} {...props}>
      {children}
    </Link>
  );
};

BackgroundLink.propTypes = {
  backgroundLocation: propTypes.object,
  children: propTypes.node,
  hash: propTypes.string,
  state: propTypes.object,
  to: propTypes.string.isRequired,
};

export default BackgroundLink;
