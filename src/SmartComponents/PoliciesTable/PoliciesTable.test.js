import { policies as rawPolicies } from './fixtures.js';

jest.mock('react-router-dom', () => (
    {
        history: {
            push: jest.fn()
        },
        withRouter: jest.fn()
    }
));

import { PoliciesTable } from './PoliciesTable.js';
const policies = rawPolicies.edges.map(profile => profile.node);

describe('PoliciesTable', () => {
    let wrapper;
    let instance;

    it('expect to render without error', () => {
        wrapper = shallow(
            <PoliciesTable policies={ policies } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render emptystate', () => {
        wrapper = shallow(
            <PoliciesTable policies={[]} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('Pagination and search', () => {
        beforeEach(() => {
            wrapper = shallow(
                <PoliciesTable
                    policies={ policies }
                />);
            instance = wrapper.instance();
        });

        it('should show only matching results after searching', async () => {
            await instance.onFilterUpdate('name', 'CCP');
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should be able to move to next and previous pages', async () => {
            await instance.changePage(2, 10);
            expect(toJson(wrapper)).toMatchSnapshot();
            await instance.changePage(1, 10);
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe('setAndDeletePolicy', () => {
        beforeEach(() => {
            wrapper = shallow(
                <PoliciesTable
                    policies={ policies }
                />);
            instance = wrapper.instance();
        });

        it('should set the policy in state and open modal', async () => {
            await instance.setAndDeletePolicy(policies[0].id);
            expect(wrapper.state()).toMatchSnapshot();
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
