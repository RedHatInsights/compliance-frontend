import React from 'react';
import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { init } from 'Store';

const queryClient = new QueryClient();

const TestWrapper = ({ children, routes, store: propStore }) => {
  const store = init().getStore();

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...(routes ? { initialEntries: routes } : {})}>
        <Provider store={propStore || store}>{children}</Provider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

TestWrapper.propTypes = {
  children: propTypes.node,
  mocks: propTypes.array,
  routes: propTypes.array,
  store: propTypes.object,
};

export default TestWrapper;
