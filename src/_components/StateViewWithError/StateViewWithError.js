import React from 'react';
import propTypes from 'prop-types';

import ErrorPage from '../ErrorPage';
import StateViewPart from '../StateViewPart';
import StateView from '../StateView';

export const StateViewWithError = ({ stateValues, children }) => (
  <StateView stateValues={stateValues}>
    <StateViewPart key="error-state" stateKey="error">
      <ErrorPage error={stateValues.error} />
    </StateViewPart>
    {children}
  </StateView>
);

StateViewWithError.propTypes = {
  stateValues: propTypes.object,
  children: propTypes.node,
};
