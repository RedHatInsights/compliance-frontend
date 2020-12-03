import BackgroundLink from './BackgroundLink';
import { useLocation } from 'react-router-dom';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: jest.fn()
}));

describe('BackgroundLink', () => {
    it('expect to render without error', () => {
        useLocation.mockImplementation(() => ({
            hash: '#anchor',
            path: '/current/location'
        }));
        const wrapper = shallow(
            <BackgroundLink to='/test/location'>Test background link</BackgroundLink>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
