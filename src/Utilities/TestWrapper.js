import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { Provider } from 'react-redux';
import { init } from 'Store';

const TestWrapper = ({ children, mocks = [], routes, store: propStore }) => {
  const store = init().getStore();

  return (
    <MemoryRouter {...(routes ? { initialEntries: routes } : {})}>
      <Provider store={propStore || store}>
        <MockedProvider mocks={mocks} addTypename>
          {children}
        </MockedProvider>
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
