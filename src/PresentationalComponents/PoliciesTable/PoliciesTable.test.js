import { policies as rawPolicies  } from '@/__fixtures__/policies.js';
import { filterHelpers } from 'Utilities/hooks/useTableTools/testHelpers.js';
import { PoliciesTable, PolicyNameCell, FILTER_CONFIGURATION } from './PoliciesTable.js';

expect.extend(filterHelpers);

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    Link: () => ('Mocked Link'),
    useLocation: jest.fn()
}));

const policies = rawPolicies.edges.map(profile => profile.node);

describe('PoliciesTable', () => {
    const defaultProps = {
        history: { push: jest.fn() },
        location: {}
    };
    let wrapper;
    let instance;

    it('expect to render without error', () => {
        wrapper = shallow(
            <PoliciesTable
                { ...defaultProps }
                policies={ policies } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render emptystate', () => {
        wrapper = shallow(
            <PoliciesTable
                { ...defaultProps }
                policies={[]} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render SystemsCountWarning', () => {
        wrapper = shallow(
            <PoliciesTable
                { ...defaultProps }
                policies={ policies.map((p) => ({ ...p, totalHostCount: 0 })) } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('Pagination and search', () => {
        beforeEach(() => {
            wrapper = shallow(
                <PoliciesTable
                    { ...defaultProps }
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

    it('expect to have filters properly rendered', () => {
        const component = <PoliciesTable
            { ...defaultProps }
            policies={ policies } />;

        expect(component).toHaveFiltersFor(FILTER_CONFIGURATION);
    });
});

describe('PolicyNameCell', () => {
    it('expect to render without error', () => {
        let profile = policies[0];
        let wrapper = shallow(
            <PolicyNameCell profile={ profile } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
