import toJson from 'enzyme-to-json';
import { MockedProvider } from '@apollo/react-testing';
import DeletePolicy from './DeletePolicy.js';

describe('DeletePolicy', () => {
    it('expect not to render anything for a closed modal', () => {
        const component = mount(
            <MockedProvider>
                <DeletePolicy
                    isModalOpen={false}
                    toggle={() => {}}
                    onDelete={() => {}}
                    policy={ { id: 1, name: 'foo' } } />
            </MockedProvider>
        );

        expect(toJson(component)).toMatchSnapshot();
    });

    it('expect to render an open modal without error', () => {
        const component = mount(
            <MockedProvider>
                <DeletePolicy
                    isModalOpen={true}
                    toggle={() => {}}
                    onDelete={() => {}}
                    policy={ { id: 1, name: 'foo' } } />
            </MockedProvider>
        );

        expect(toJson(component)).toMatchSnapshot();
    });
});

