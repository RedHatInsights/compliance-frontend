import { render } from '@testing-library/react';

import BackgroundLink from './BackgroundLink';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: () => 'Mocked Link',
  useLocation: jest.fn(),
}));

describe('BackgroundLink', () => {
  beforeEach(() => {
    useLocation.mockImplementation(() => ({
      hash: '#anchor',
      path: '/current/location',
    }));
  });

  it('expect to render without error', () => {
    const { asFragment } = render(
      <BackgroundLink to="/test/location">Test background link</BackgroundLink>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
