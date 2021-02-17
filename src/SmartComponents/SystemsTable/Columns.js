import React from 'react';
import {
    Name, ComplianceScore, DetailsLink, FailedRules, LastScanned, Policies, SSGVersion
} from './Cells';

const logArgs = (...args) => (
    console.log(...args)
);

const renderComponent = (Component) => (
    (_data, _id, entity) => (  // eslint-disable-line react/display-name
        <Component { ...entity } />
    )
);

// isStatic: true prevents sortable to be added as a transform
const columns = [{
    // key: 'name', // key: 'display_name'
    title: 'Name',
    props: {
        width: 40,
        isStatic: true
    },
    renderFunc: renderComponent(Name)
}, {
    key: 'facts.compliance',
    title: 'SSG version',
    column: 'ssg',
    props: {
        isStatic: true
    },
    renderFunc: renderComponent(SSGVersion)
}, {
    key: 'policies',
    title: 'Policies',
    props: {
        width: 40,
        isStatic: true
    },
    renderFunc: renderComponent(Policies)
}, {
    title: '',
    column: 'details-link',
    props: {
        width: 20,
        isStatic: true
    },
    renderFunc: renderComponent(DetailsLink)
}, {
    title: 'Failed rules',
    props: {
        width: 5,
        isStatic: true
    },
    renderFunc: renderComponent(FailedRules)
}, {
    title: 'Compliance score',
    column: 'score',
    props: {
        width: 5,
        isStatic: true
    },
    renderFunc: renderComponent(ComplianceScore)
}, {
    title: 'Last scanned',
    column: 'scanned',
    props: {
        width: 10,
        isStatic: true
    },
    renderFunc: renderComponent(LastScanned)
}];

export const selectedColumns = (selected = ['Name']) => (
    columns.filter((column) => (
        selected.includes(column.title) || selected.includes(column.column)
    ))
);

export default selectedColumns;
