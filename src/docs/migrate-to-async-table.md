In order to migrate a page using the `TableToolsTable` to the `AsyncTableToolsTable` the following steps need to happen:

1. Replace `TableToolsTable` with the {@link AsyncTableToolsTable}
2. Wrap the component using the table with the {@link TableStateProvider}, above where we want to access the serialised table state for the {@link useQuery} hook or the API client instance.
3. Correct or add the necessary `filterAttribute` or `filterSerialiser` properties for filters
4. Correct or add the necessary `sortable` property for columns.
5. Add the `numberOfItems` option to be passed to the `AsyncTableToolsTable` from the "meta" section or the API response to enable pagination.
6. Integrate the serialised table state with {@link useQuery}
