## Use AsyncTableToolsTable with an async function

The `AsyncTableToolsTable` component can be used with an async function to retrieve items to show in the page.
The function will be called with the current `serialisedTableState`, and the "raw" `tableState`.

A basic example component using the `AsyncTableToolsTable` this way would look like this:

```js
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';

const columns = [
 {
   title: 'Name',
   sortByProperty: 'name',
   exportKey: 'name',
   renderFunc: (_a, _b, item) => item.name,
 },
];


const fetchItems = (serilisedTableState) =>
  fetch('/api/items', {
    params: {
      pagination: serilisedTableState.pagination,
    }
  })

const Page = () => {
  return <AsyncTableToolsTable items={fetchItems} columns={columns}/>
}

export default Page;
```

## Using AsyncTableToolsTable with a Context

To allow making queries with async hook, like the `useQuery` hook, the table state can be access via a context.
For this the `TableStateProvider` needs to be added. The above example would than look like this:


```js
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';

const columns = [
 {
   title: 'Name',
   sortByProperty: 'name',
   exportKey: 'name',
   renderFunc: (_a, _b, item) => item.name,
 },
];

const Page = () => {
  const serialisedTableState = useSerialisedTableState();

  const { data } = useQuery('/api/items', {
    params: {
      pagination: serilisedTable.pagination,
    }
  })

  return <AsyncTableToolsTable items={data} columns={columns}/>
}

const PageWithTableStateProvider = () =>
  <TableStateProvider>
    <Page />
  </TableStateProvider>

export default PageWithTableStateProvider;
```
