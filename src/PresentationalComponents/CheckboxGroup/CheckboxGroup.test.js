import renderer from 'react-test-renderer';
import { CheckboxFieldArray } from './CheckboxGroup';

jest.mock('redux-form', () => ({
    Field: 'Field'
}));

describe('CheckboxFieldArray', () => {
    let input;
    let options;

    beforeEach(() => {
        input = { name: 'policies', value: '' };
        options = [
            {
                label: 'pci', value: '12345', defaultChecked: false
            },
            {
                label: 'hipaa', value: '1111', defaultChecked: true
            }
        ];
    });

    it('expect to render with default checked fields', () => {
        const component = renderer.create(
            <CheckboxFieldArray input={input} options={options} />
        );

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('expect to render without default checked fields', () => {
        options[0].defaultChecked = undefined;
        options[1].defaultChecked = undefined;

        const component = renderer.create(
            <CheckboxFieldArray input={input} options={options}/>
        );

        expect(component.toJSON()).toMatchSnapshot();
    });
});
