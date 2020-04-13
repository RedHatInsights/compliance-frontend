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
debounce.mockImplementation(fn => fn);

import { PoliciesTable } from './PoliciesTable.js';

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
            const instance = wrapper.instance();
            await instance.onFilterUpdate('name', 'CCP');
            expect(toJson(wrapper)).toMatchSnapshot();
        });

        it('should be able to move to next and previous pages', async () => {
            const instance = wrapper.instance();
            await instance.changePage(2, 10);
            expect(toJson(wrapper)).toMatchSnapshot();
            await instance.changePage(1, 10);
            expect(toJson(wrapper)).toMatchSnapshot();
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
        expect(history.push).toHaveBeenNthCalledWith(1, `/reports/${policyRows[1].id}`);
        history.push.mockReset();
        await instance.actionResolver({ id: 4 })[0].onClick();
        expect(history.push).toHaveBeenNthCalledWith(1, `/reports/${policyRows[4].id}`);
        history.push.mockReset();
        await instance.setState({ page: 2, perPage: 10 });
        await instance.actionResolver({ id: 0 })[0].onClick();
        expect(history.push).toHaveBeenNthCalledWith(1, `/reports/${policyRows[10].id}`);
        history.push.mockReset();
        await instance.actionResolver({ id: 2 })[0].onClick();
        expect(history.push).toHaveBeenNthCalledWith(1, `/reports/${policyRows[12].id}`);
    });
});
