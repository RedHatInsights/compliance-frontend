import React from 'react';
import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { init } from 'Store';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';

const queryClient = new QueryClient();

// TODO Remove TableStateProvider when moving to tabletools package
const TestWrapper = ({ children, routes, store: propStore }) => {
  const store = init().getStore();

  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter {...(routes ? { initialEntries: routes } : {})}>
        <TableStateProvider>
          <Provider store={propStore || store}>{children}</Provider>
        </TableStateProvider>
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
