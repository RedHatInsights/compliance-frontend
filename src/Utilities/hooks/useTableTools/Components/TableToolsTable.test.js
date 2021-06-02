import TableToolsTable from './TableToolsTable';
import items from '../__fixtures__/items';
import columns from '../__fixtures__/columns';
import filters from '../__fixtures__/filters';

describe('TableToolsTable', () => {
    const exampleItems = items(30).sort((item) => (item.name));

    it('expect to render without error', () => {
        const wrapper = shallow(
            <TableToolsTable
                items={ exampleItems }
                columns={ columns }
                filters={ { filterConfig: filters } } />
        );

        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
