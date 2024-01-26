import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';

import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const initialState = {};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const TestWrapper = ({ children, mocks = [], routes, store: propStore }) => {
  const store = createStore(reducer, initialState);

  return (
    <MemoryRouter {...(routes ? { initialEntries: routes } : {})}>
      <Provider store={propStore || store}>
        <MockedProvider mocks={mocks}>{children}</MockedProvider>
      </Provider>
    </MemoryRouter>
  );
};

TestWrapper.propTypes = {
  children: propTypes.node,
  mocks: propTypes.array,
  routes: propTypes.array,
  store: propTypes.object,
};

export default TestWrapper;
