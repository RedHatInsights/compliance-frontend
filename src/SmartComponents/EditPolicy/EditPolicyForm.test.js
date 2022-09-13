import propTypes from 'prop-types';
import { render } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import { BENCHMARKS_QUERY } from './constants';

import { policies } from '@/__fixtures__/policies.js';

import { createMemoryHistory } from 'history';
import { Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import EditPolicyForm from './EditPolicyForm';
import { useNewRulesAlertState } from './hooks';

jest.mock('./hooks', () => ({
  ...jest.requireActual('./hooks'),
  useNewRulesAlertState: jest.fn(() => [false, () => false]),
}));

const initialState = {};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const TestWrapper = ({ children, mocks = [] }) => {
  const history = createMemoryHistory();
  const store = createStore(reducer, initialState);

  return (
    <Provider store={store}>
      <Router history={history}>
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      </Router>
    </Provider>
  );
};

TestWrapper.propTypes = {
  children: propTypes.node,
  mocks: propTypes.arra,
};

describe('EditPolicyForm', () => {
  const policy = {
    ...policies.edges[0].node,
    supportedOsVersions: ['7.8', '7.9'],
  };
  const mocks = [
    {
      request: {
        query: BENCHMARKS_QUERY,
      },
      result: {
        data: {},
      },
    },
  ];
  const defaultProps = {
    setUpdatedPolicy: () => ({}),
    setSelectedRuleRefIds: () => ({}),
    setSelectedSystems: () => ({}),
    policy,
  };

  it('expect to render without error', () => {
    useNewRulesAlertState.mockImplementation(() => [false, () => false]);
    const { asFragment } = render(
      <TestWrapper mocks={mocks}>
        <EditPolicyForm {...defaultProps} />
      </TestWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with alter', () => {
    useNewRulesAlertState.mockImplementation(() => [true, () => true]);
    const { asFragment } = render(
      <TestWrapper mocks={mocks}>
        <EditPolicyForm {...defaultProps} />
      </TestWrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
