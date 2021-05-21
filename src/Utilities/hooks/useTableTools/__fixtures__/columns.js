import { severityLevels } from './items';

export default [
    {
        title: 'Name',
        sortByProperty: 'name',
        renderFunc: (_a, _b, item) => (
            item.name
        )
    }, {
        title: 'Description',
        sortByProperty: 'description'
    }, {
        title: 'Severity sorted by function',
        sortByFunction: (item) => (item.name),
        renderFunc: (_a, _b, item) => (
            item.severity
        )
    }, {
        title: 'Severity by Array',
        sortByProperty: 'severity',
        sortByArray: severityLevels,
        renderFunc: (_a, _b, item) => (
            item.severity
        )
    }
];
