import toJson from 'enzyme-to-json';

import {
    ReduxFormTextInput,
    ReduxFormCheckboxInput,
    ReduxFormCreatableSelectInput
} from './ReduxFormWrappers';

describe('ReduxFormTextInput', () => {
    it('expect to render without error', () => {
        const field = {
            input: {
                onChange: jest.fn(),
                value: 'Value'
            },
            additionalProp: 'Prop1'
        };
        const wrapper = shallow(
            <ReduxFormTextInput { ...field } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render with defaultValue', () => {
        const field = {
            input: {
                onChange: jest.fn()
            },
            defaultValue: 'Default Value',
            additionalProp: 'Prop1'
        };
        const wrapper = shallow(
            <ReduxFormTextInput { ...field } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ReduxFormCheckboxInput', () => {
    it('expect to render without error', () => {
        const field = {
            input: {
                onChange: jest.fn(),
                value: 'Value'
            },
            additionalProp: 'Prop1'
        };
        const wrapper = shallow(
            <ReduxFormCheckboxInput { ...field } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});

describe('ReduxFormCreatableSelectInput', () => {
    it('expect to render without error', () => {
        const field = {
            input: {
                onChange: jest.fn()
            },
            selected: 'SELECTED_VALUE',
            additionalProp: 'Prop1'
        };
        const wrapper = shallow(
            <ReduxFormCreatableSelectInput { ...field } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
