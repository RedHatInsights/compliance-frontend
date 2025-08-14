import React from 'react';
import propTypes from 'prop-types';
import { ErrorPage } from 'PresentationalComponents';

export const StateViewPart = ({ children }) => children;

const props = {
  stateValues: propTypes.object,
  children: propTypes.node,
};

export const StateView = ({ stateValues, children }) =>
  children
    .flatMap((c) => c)
    .filter((child) => stateValues[child.props.stateKey]);

StateView.propTypes = props;

export const StateViewWithError = ({ stateValues, children }) => (
  <StateView stateValues={stateValues}>
    <StateViewPart key="error-state" stateKey="error">
      <ErrorPage error={stateValues.error} />
    </StateViewPart>
    {children}
  </StateView>
);

StateViewWithError.propTypes = props;
