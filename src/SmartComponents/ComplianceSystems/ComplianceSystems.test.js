import { render } from '@testing-library/react';
import { ComplianceSystems } from './ComplianceSystems.js';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => ({})),
}));

jest.mock('@apollo/client', () => ({
  useQuery: () => ({ data: [], error: undefined, loading: undefined }),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: '',
  }),
}));

describe('ComplianceSystems', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(<ComplianceSystems />);

    expect(asFragment()).toMatchSnapshot();
  });
});
