import toJson from 'enzyme-to-json';
import { policies } from './fixtures.js';
import debounce from 'lodash/debounce';
import { history } from 'react-router-dom';

jest.mock('react-router-dom', () => (
    {
        history: {
            push: jest.fn()
        },
        withRouter: jest.fn()
    }
));

jest.mock('lodash/debounce');
jest.mock('@apollo/react-hooks');
debounce.mockImplementation(fn => fn);
jest.mock('../CreatePolicy/EditPolicyRules', () => {
    return <p>Rules table</p>;
});
jest.mock('@redhat-cloud-services/frontend-components-inventory-compliance', () => {
    const ComplianceRemediationButton = () => <button>Remediations</button>;
    return ComplianceRemediationButton;
});

import { PoliciesTable, policiesToRows } from './PoliciesTable.js';

describe('PoliciesTable', () => {
    it('expect to render without error', () => {
        const wrapper = shallow(
            <PoliciesTable policies={policies.edges.map(profile => profile.node)} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to render emptystate', () => {
        const wrapper = shallow(
            <PoliciesTable policies={[]} />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    describe('Pagination and search', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(
                <PoliciesTable
                    policies={policies.edges.map(profile => profile.node)}
                />);
        });

        it('should show only matching results after searching', async () => {
            const filteredProfiles = policies.edges.filter(row => row.node.name.match(/CCP/)).map(profile => profile.node);
            const searchResults = policiesToRows(filteredProfiles);
            const instance = wrapper.instance();
            await instance.handleSearch('CCP');
            expect(wrapper.state('currentRows')).toEqual(searchResults);
        });

        it('should be able to move to next and previous pages', async () => {
            const pageOnePolicies = policiesToRows(
                policies.edges.slice(0, 10).map(profile => profile.node)
            );
            const pageTwoPolicies = policiesToRows(
                policies.edges.slice(10, 20).map(profile => profile.node)
            );
            const instance = wrapper.instance();
            await instance.changePage(2, 10);
            expect(wrapper.state('currentRows')).toEqual(pageTwoPolicies);
            await instance.changePage(1, 10);
            expect(wrapper.state('currentRows')).toEqual(pageOnePolicies);
        });

    });

    it('should lead to the right page when clicking on View latest results', async () => {
        const policyRows = policies.edges.map(profile => profile.node);
        const wrapper = shallow(
            <PoliciesTable
                history={history}
                policies={policyRows}
            />);
        const instance = wrapper.instance();
        await instance.setState({ page: 1, perPage: 10 });
        await instance.actionResolver({ id: 1 })[0].onClick();
        expect(history.push).toHaveBeenNthCalledWith(1, `/policies/${policyRows[1].id}`);
        history.push.mockReset();
        await instance.actionResolver({ id: 4 })[0].onClick();
        expect(history.push).toHaveBeenNthCalledWith(1, `/policies/${policyRows[4].id}`);
        history.push.mockReset();
        await instance.setState({ page: 2, perPage: 10 });
        await instance.actionResolver({ id: 0 })[0].onClick();
        expect(history.push).toHaveBeenNthCalledWith(1, `/policies/${policyRows[10].id}`);
        history.push.mockReset();
        await instance.actionResolver({ id: 2 })[0].onClick();
        expect(history.push).toHaveBeenNthCalledWith(1, `/policies/${policyRows[12].id}`);
    });
});
