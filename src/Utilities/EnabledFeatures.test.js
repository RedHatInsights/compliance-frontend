/*global localStorageMock*/
import { getStoredFeatures, EnabledFeatures } from './EnabledFeatures';

jest.mock('@/constants', () => ({
    features: {
        defaultFeature: true,
        featureToEnable: false
    }
}));
jest.mock('react-router-dom', () => ({
    ...require.requireActual('react-router-dom'),
    useLocation: jest.fn(() => ({}))
}));

afterEach(() => (localStorageMock.clear()));

describe('getStoredFeatures', () => {
    it('loads defaults', () => {
        expect(getStoredFeatures()).toStrictEqual({
            defaultFeature: true,
            featureToEnable: false
        });
    });

    it('loads defaults and stored feature configuration', () => {
        localStorageMock.setItem('insights:compliance:featureToEnable', 'true');
        expect(getStoredFeatures()).toStrictEqual({
            defaultFeature: true,
            featureToEnable: true
        });
    });
});

describe('Reports', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <EnabledFeatures>
                <div>PAGE</div>
            </EnabledFeatures>
        );
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
