## Use AsyncTableToolsTable with an async function

The {@link AsyncTableToolsTable} component can be used with an async function to retrieve items to show in the page.
The function will be called with the current `serialisedTableState`, and the "raw" `tableState`.

A basic example component using the `AsyncTableToolsTable` this way would look like this:

<!-- TODO check the columns renderFunc what exactly is passed -->
```js
import { fetchItems } from 'api';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';

const columns = [
 {
   title: 'Name',
   renderFunc: (_data, _rowId, item) => item.name,
 },
];


const fetchItems = async () =>
  fetch('/api/items')

const Page = () =>
  <AsyncTableToolsTable items={fetchItems} columns={columns}/>;

export default Page;
```

In this example, we pass an array of columns, with a title to show in the table header,
and `renderFunc` to render cells in a row for this column.

We also provide the `fetchItems` function, which will call our imaginary API and return an array of items for rows to render.

### Accessing the table state

To allow accessing the table state, like pagination, filters, or sorting and making queries with async hook,
like the `useQuery` hook, the `TableStateProvider` needs to be added.

The above example would than look like this:

```js
import { fetchItems } from 'api';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
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

  return (
    <AsyncTableToolsTable items={data} columns={columns} />
  );
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
import { fetchItems } from 'api';
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
      ...serialisedTableState.pagination,
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

Note that we move from the `useTableState` to the `useSerialisedTableState`.

### Providing filters and a filterSerialiser

In order to allow selecting filters and passing them on to request data with these filters we need to provide filters,
and provide a serialiser similar to the `paginationSerialiser` function above, but for filters of our imaginary API.

The {@link useFilterConfig} hook used by the {@link AsyncTableToolsTable} supports any filter the [ConditionalFilter](https://github.com/RedHatInsights/frontend-components/blob/master/packages/components/doc/conditionalFilter.md) component supports:

 * text
 * checkbox
 * radio
 * group

To add a text filter for the name in our example table, we can provide a `filters` prop as the configuration to the `AsyncTableToolsTable`

```js
import { fetchItems } from 'api';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';

const columns = [
 {
   title: 'Name',
   renderFunc: (_a, _b, item) => item.name,
 },
];

const filters = [
  {
    type: 'text',
    label: 'Name',
  }
];

const paginationSerialiser = ({page, perPage}) =>
  { offset: (page-1) * perPage, limit: perPage }

const Page = () => {
  const serialisedTableState = useSerialisedTableState();

  const { data } = useQuery('/api/items', {
    params: {
      ...serialisedTableState.pagination,
    }
  })

  return (
    <AsyncTableToolsTable
      items={data}
      columns={columns}
      filters={filters}
      options={{
        serialisers: {
          pagination: paginationSerialiser,
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

This will give us the UI elements to set a filter and remove it.
To pass it on to the API, we'll add a serialiser function called "filtersSerialiser" and pass it on in the options.

```js
import { fetchItems } from 'api';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';

const columns = [
 {
   title: 'Name',
   renderFunc: (_a, _b, item) => item.name,
 },
];

const filters = [
  {
    type: 'text',
    label: 'Name',
  }
];

const filtersSerialiser = (filterState) => ({
    filter: Object.entries(filterState).reduce((filterStringParts, [filterId, filterValue]) =>
      `${filterId}=${filterValue}`
    , []).join(' AND ')
  });

const paginationSerialiser = ({page, perPage}) =>
  { offset: (page-1) * perPage, limit: perPage }

const Page = () => {
  const serialisedTableState = useSerialisedTableState();

  const { data } = useQuery('/api/items', {
    params: {
      ...serialisedTableState.pagination,
      ...serialisedTableState.filters
    }
  })

  return (
    <AsyncTableToolsTable
      items={data}
      columns={columns}
      filters={filters}
      options={{
        serialisers: {
          pagination: paginationSerialiser,
          filters: filtersSerialiser,
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

In our example the `filtersSerialiser` is taking the `filterState` it is passed and
transforms it into a string to pass on as the `filter` parameter for our magic API.
Our `filtersSerialiser` only uses the first parameter, but the function is also called
with the filter configuration passed in for the table to construct a filter for an API.

### Enable sorting data

To enable the sorting on columns, they need to have a `sortable` property:

```js
import { fetchItems } from 'api';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import AsyncTableToolsTable from '@/Frameworks/AsyncTableTools/components/AsyncTableToolsTable';
import { useSerialisedTableState } from '@/Frameworks/AsyncTableTools/hooks/useTableState';

const columns = [
 {
   title: 'Name',
   renderFunc: (_a, _b, item) => item.name,
   sortable: 'name'
 },
];

const filters = [
  {
    type: 'text',
    label: 'Name',
  }
];

const filtersSerialiser = (filterState) => ({
    filter: Object.entries(filterState).reduce((filterStringParts, [filterId, filterValue]) =>
      `${filterId}=${filterValue}`
    , []).join(' AND ')
  });

const paginationSerialiser = ({page, perPage}) =>
  { offset: (page-1) * perPage, limit: perPage }

const sortSerialiser = ({ index, direction }, columns) =>
   `${columns[index].sortable}:${direction}`;

const Page = () => {
  const serialisedTableState = useSerialisedTableState();

  const { data } = useQuery('/api/items', {
    params: {
      ...serialisedTableState.pagination,
      ...serialisedTableState.filters,
      sort_by: serialisedTableState.sort
    }
  })

  return (
    <AsyncTableToolsTable
      items={data}
      columns={columns}
      filters={filters}
      options={{
        serialisers: {
          pagination: paginationSerialiser,
          filters: filtersSerialiser,
          sort: sortSerialiser
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

This will add the Patternfly "sortable" `Table` transform and add a table state when columns are clicked.
In our example the "sortable" prop is a string, which we use to define the attribute the item is sortable by in our awesome API.
But the "sortable" property can be anything, even just a boolean.


With this we should now have a fully functioning table that allows to show, filterable, sortable and paginated data from an API.
