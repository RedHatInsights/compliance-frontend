import propTypes from 'prop-types';
import { MemoryRouter } from 'react-router-dom';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import { Provider } from 'react-redux';
import { init } from 'Store';

const TestWrapper = ({ children, routes, store: propStore }) => {
  const store = init().getStore();

  return (
    <MemoryRouter {...(routes ? { initialEntries: routes } : {})}>
      <TableStateProvider>
        <Provider store={propStore || store}>{children}</Provider>
      </TableStateProvider>
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
