To be able and filter in tables in Compliance and translate these filters into a Compliance scoped search filter string,
we make use of the "serialiser" feature of the `AsyncTableToolsTable` for filters.

A default `filterSerialiser` function, that can transform the values most of the filters into a scoped search query, provided by the `useFilterConfig` hook and the [ConditionalFilter](https://github.com/RedHatInsights/frontend-components/blob/master/packages/components/doc/conditionalFilter.md) component.
For filters that can not be transformed out of the box can provide a custom serialisation function.

## Filter by attribute

A basic text filter to search the `name` attribute in the API would look like this:

```
const policyNameFilter = [
  {
    label: 'Policy name',
    type: 'text',
    filterAttribute: 'name',
  }
];
```

The `label` property simple defines what the filter is called in the `ConditionalFilter`.
The `type` property defines what kind of filter it is, this is used by `useFilterConfig` itself and the `filterSerialiser`.
The `filterAttribute` property tells the `filterSerialiser`, and the text filter serialise function, which attribute to construct the scoped search query for.
The "attributes" and what can be used in a scoped search query can be found in the API documentation of that endpoint in the `filter` parameter description.

## Filter with filterSerialiser

If a filter requires a more complex query, or just needs to query two attributes,
A filter can provide a `filterSerialiser` function, which will then be used instead of the default one.

A filter with its own custom serialiser would look like this:

```
const policyNameFilter = [
  {
    label: 'Policy name',
    type: 'text',
    filterSerialiser: (_, value) =>
      `name ~ ${value} OR policy_name ~ ${value}`,
  }
];
```

The serialiser function is called by the main `filterSerialiser` function with the first parameter being the filter configuration, which we don't use here.
The second parameter is the `value` of the text filter, which we use here to construct a scoped search query for two attributes.

Multiple filters will be combined by the serialiser with an " AND ".
