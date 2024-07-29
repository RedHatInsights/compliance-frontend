```js
const items = [{name: 'Hello'}];

const columns = [
 {
   title: 'Name',
   sortByProperty: 'name',
   exportKey: 'name',
   renderFunc: (_a, _b, item) => item.name,
 },
];

<AsyncTableToolsTable items={items} columns={columns}/>

// or with providing a async function

<AsyncTableToolsTable items={async () => items} columns={columns}/>

```
