import React, { useState } from 'react';
import { sortable, fitContent } from '@patternfly/react-table';
import Main from '@redhat-cloud-services/frontend-components/Main';
import { conditionalFilterType } from '@redhat-cloud-services/frontend-components/ConditionalFilter';
import { TableToolsTable } from '@redhat-cloud-services/frontend-components-utilities/useTableTools';
import faker from 'faker';

const severityLevels = ['high', 'medium', 'low', 'unknown'];
const exampleItems = (count) => {
    let currentCount = 0;
    return [...new Array(count > 0 ? count : 1)].map(() => {
        currentCount++;
        const randomNumber = Math.floor(Math.random() * severityLevels.length);
        return {
            id: currentCount,
            severity: severityLevels[ randomNumber ],
            name: faker.random.word(),
            description: faker.lorem.sentence()
        };
    });
};

/* eslint-disable react/display-name */
const exampleColumns = [
    {
        title: 'Name',
        key: 'name',
        transforms: [sortable],
        sortByProperty: 'name',
        renderFunc: (item) => (
            item.name
        )
    }, {
        title: 'Description',
        key: 'description'
    }, {
        title: 'Severity sorted by function',
        transforms: [sortable],
        sortByFunction: (item) => (severityLevels.indexOf(item.severity)),
        renderFunc: (item) => (
            item.severity
        )
    }, {
        title: 'Severity by Array',
        transforms: [sortable, fitContent],
        sortByProperty: 'severity',
        sortByArray: severityLevels,
        renderFunc: (item) => (
            item.severity
        )
    }
];
/* eslint-enable */

const exampleFilter = [
    {
        type: conditionalFilterType.text,
        label: 'Name',
        filter: (items, value) => (items.filter((item) => (
            item?.name.includes(value)
        )))
    }
];

const ExampleTable = () => {
    const [exampleCount, setExampleCount] = useState(1000);

    return <Main>
        <p>
            Items: <input type="slider" value={ exampleCount || '' } onChange={(event) => {
                const newCount = parseInt(event.target.value);
                setExampleCount(newCount < 1500 ? newCount : 1500);
            }}/>
        </p>
        <hr style={ { margin: '2em 0' } } />
        <TableToolsTable
            aria-label="Example Table"
            onSelect={ (...args) => (
                console.log('ON SELECT EXAMPLE', ...args)
            ) }
            filters={ exampleFilter }
            items={ exampleItems(exampleCount) }
            columns={ exampleColumns } />
    </Main>;
};

export default ExampleTable;
