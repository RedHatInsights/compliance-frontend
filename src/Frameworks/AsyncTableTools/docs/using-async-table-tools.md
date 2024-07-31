## Use AsyncTableToolsTable with an async function

The {@link AsyncTableToolsTable} component can be used with an async function to retrieve items to show in the page.
The function will be called with the current `serialisedTableState`, and the "raw" `tableState`.

A basic example component using the `AsyncTableToolsTable` this way would look like this:

```js
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';

const columns = [
 {
   title: 'Name',
   renderFunc: (_a, _b, item) => item.name,
 },
];


const fetchItems = (serilisedTableState) =>
  fetch('/api/items')

const Page = () => {
  return <AsyncTableToolsTable items={fetchItems} columns={columns}/>;
};

export default Page;
```

### Accessing the table state

To allow accessing the table state, like pagination, filters, or sorting and making queries with async hook,
like the `useQuery` hook, the `TableStateProvider` needs to be added.

The above example would than look like this:

```js
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import { useTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';

const columns = [
 {
   title: 'Name',
   renderFunc: (_a, _b, item) => item.name,
 },
];

const Page = () => {
  const tableState = useTableState();

  const { data } = useQuery('/api/items', {
    params: {
      page: tableState.pagination.page,
      perPage: tableState.pagination.perPage,
    }
  })

  return <AsyncTableToolsTable items={data} columns={columns} />;
};

const PageWithTableStateProvider = () =>
  <TableStateProvider>
    <Page />
  </TableStateProvider>

export default PageWithTableStateProvider;
```

### Serialising the table state

To allow a conversion from the "raw" table state to something consumable for an API "serialisers" can be provided.
A serialiser function is called with the current table state and optionally with configuration parameters and allows returning a modified, "serialised", state.

A serialiser function can be provided in the AsyncTableTools `options` prop for the "pagination", "sort" and "filters"

If we wanted to serialise the pagination state to pass to the API,
our example would need to provide a serialiser and access it via the {@link useSerialisedTableState} hook

```js
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';

const columns = [
 {
   title: 'Name',
   renderFunc: (_a, _b, item) => item.name,
 },
];

const paginationSerialiser = ({page, perPage}) =>
  { offset: (page-1) * perPage, limit: perPage }

const Page = () => {
  const serialisedTableState = useSerialisedTableState();

  const { data } = useQuery('/api/items', {
    params: {
      ...serialisedTableState.pagination
    }
  })

  return (
    <AsyncTableToolsTable
      items={data}
      columns={columns}
      options={{
        serialisers: {
          pagination: paginationSerialiser
        }
      }}
    />
  );
};

const PageWithTableStateProvider = () =>
  <TableStateProvider>
    <Page />
  </TableStateProvider>

export default PageWithTableStateProvider;
```
