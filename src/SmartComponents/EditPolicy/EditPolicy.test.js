import { useLocation } from 'react-router-dom';
jest.mock('react-redux', () => ({
    ...require.requireActual('react-redux'),
    useSelector: jest.fn(() => ({})),
    useDispatch: jest.fn(() => ({}))
}));
jest.mock('./usePolicyUpdate', () => (() => {}));
jest.mock('react-router-dom', () => ({
    ...require.requireActual('react-router-dom'),
    useLocation: jest.fn(),
    useHistory: jest.fn(() => ({}))
}));
jest.mock('Utilities/hooks/useDocumentTitle', () => ({
    useTitleEntity: () => ({}),
    setTitle: () => ({})
}));

import { EditPolicy } from './EditPolicy.js';

describe('EditPolicy', () => {

    const defaultProps = {
        onClose: jest.fn(),
        dispatch: jest.fn(),
        change: jest.fn()
    };

    beforeEach(() => {
        useLocation.mockImplementation(() => ({
            hash: '#details',
            state: {
                policy: {
                    id: 'POLICY_ID',
                    name: 'Policy Name',
                    businessObjective: {
                        title: 'BO title',
                        id: 1
                    },
                    complianceThreshold: '30',
                    hosts: []
                }
            }
        }));
    });

    it('expect to render without error', () => {
        const wrapper = shallow(
            <EditPolicy { ...defaultProps }/>
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render with active tab open', () => {
        const wrapper = shallow(
            <EditPolicy
                { ...defaultProps }
                activeTab={ 1 } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
