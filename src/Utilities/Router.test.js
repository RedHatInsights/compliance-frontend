import Router from './Router';
import { routes } from '@/Routes';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

describe('Router', () => {
  it('expect to render without error', () => {
    useLocation.mockImplementation(() => ({
      pathname: '/reports',
    }));
    const wrapper = shallow(<Router {...{ routes }} />);

    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
