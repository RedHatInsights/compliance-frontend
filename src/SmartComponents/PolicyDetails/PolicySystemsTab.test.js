import { render } from '@testing-library/react';
import PolicySystemsTab from './PolicySystemsTab';
import { policies } from '@/__fixtures__/policies';

jest.mock('react-router-dom', () => ({
  __esModule: true,
  useLocation: jest.fn().mockReturnValue({
    pathname: '/another-route',
    search: '',
    hash: '',
    state: null,
    key: '5nvxpbdafa',
  }),
}));

describe('PolicySystemsTab', () => {
  it('expect to render without error', () => {
    const policy = policies.edges[0].node;
    const { asFragment } = render(<PolicySystemsTab {...{ policy }} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it('expect to render with no systems table', () => {
    const policy = {
      ...policies.edges[0].node,
      hosts: [],
    };
    const { asFragment } = render(<PolicySystemsTab {...{ policy }} />);

    expect(asFragment()).toMatchSnapshot();
  });
});
