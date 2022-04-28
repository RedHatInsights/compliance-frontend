import { render } from '@testing-library/react';
import LinkWithPermission from './LinkWithPermission';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: () => 'Mocked Link',
  useLocation: jest.fn(),
}));

describe('LinkWithPermission', () => {
  it('expect to render without error', () => {
    const { asFragment } = render(
      <LinkWithPermission to="/reports">Test Warning Text</LinkWithPermission>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
