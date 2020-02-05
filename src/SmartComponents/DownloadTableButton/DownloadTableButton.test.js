import toJson from 'enzyme-to-json';

import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

import DownloadTableButton from './DownloadTableButton.js';

const mockStore = configureStore();

describe('DownloadTableButton', () => {
    const store = mockStore({});
    const defaultProps = {
        selectedEntities: [1, 2, 3]
    };
    let component;

    beforeEach(() => {
        component = mount(
            <Provider store={store}>
                <DownloadTableButton { ...defaultProps } />
            </Provider>
        );
    });

    it('expect to render the create button', () => {
        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render the create button', () => {
        component.find('button[aria-label="Actions"]').simulate('click');

        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render the create button', () => {
        expect(store.getActions().length).toEqual(0)
        component.find('button[aria-label="Actions"]').simulate('click');
        component.find('.pf-c-dropdown__menu-item').first().simulate('click');

        expect(store.getActions()[0]['type']).toEqual('@@COMPLIANCE/EXPORT_TO_CSV');
    });
});
