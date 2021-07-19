import TableToolsTable from './TableToolsTable';
import items from '../__fixtures__/items';
import columns from '../__fixtures__/columns';
import filters from '../__fixtures__/filters';
import { filterHelpers } from '../testHelpers.js';

expect.extend(filterHelpers);

describe('TableToolsTable', () => {
    const exampleItems = items(30).sort((item) => (item.name));
    const defaultProps = {
        columns,
        'aria-label': 'Test Table',
        filters: { filterConfig: filters },
        items: exampleItems
    };

    it('expect to render without error', () => {
        const wrapper = shallow(
            <TableToolsTable { ...defaultProps } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });

    it('expect to have filters properly rendered', () => {
        const component = <TableToolsTable { ...defaultProps } />;
        expect(component).toHaveFiltersFor(filters);
    });
});
