import React from 'react';

export const StateView = ({ stateValues, children }) => (
  <>
    {children
      .flatMap((c) => c)
      .filter((child) => stateValues[child.props.stateKey])}
  </>
);

StateView.propTypes = props;

export default StateView;
