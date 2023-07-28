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
  Component,
  componentProps = {},
  ...props
}) => {
  const ComponentToRender = Component || Link;
  const currentLocation = useLocation();
  const background = { ...currentLocation, ...backgroundLocation };
  const state = { ...desiredState, background };

  return (
    <ComponentToRender
      to={{ pathname: to, state, hash }}
      {...{
        ...props,
        ...componentProps,
      }}
    >
      {children}
    </ComponentToRender>
  );
};

BackgroundLink.propTypes = {
  backgroundLocation: propTypes.object,
  children: propTypes.node,
  hash: propTypes.string,
  state: propTypes.object,
  to: propTypes.string.isRequired,
  Component: propTypes.node,
  componentProps: propTypes.object,
};

export default BackgroundLink;
