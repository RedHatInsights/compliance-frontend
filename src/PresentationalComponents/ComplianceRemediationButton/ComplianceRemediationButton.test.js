import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { init } from 'Store';
import ComplianceRemediationButton from './ComplianceRemediationButton';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

describe('ComplianceRemediationButton', () => {
  const store = init().getStore();
  const defaultProps = {
    allSystems: [],
    selectedRules: [],
  };

  beforeEach(() => {
    window.insights = {
      chrome: {
        getUserPermissions: () => Promise.resolve([]),
      },
      experimental: {
        loadRemediations: () => Promise.resolve([]),
      },
    };
  });

  it('expect to render without error', () => {
    const component = (
      <Provider store={store}>
        <ComplianceRemediationButton {...defaultProps} />
      </Provider>
    );
    const { container } = render(component);

    expect(container).toMatchSnapshot();
  });
});
