import React from 'react';
import { ListIcon, TreeviewIcon } from '@patternfly/react-icons';
import { Spinner } from '@patternfly/react-core';
import { treeRow } from '@patternfly/react-table';
import NoResultsTable from 'Utilities/hooks/useTableTools/Components/NoResultsTable';

import rowsBuilder from './rowsBuilder';
import treeChopper from './treeChopper';

const treeColumns = (columns, onCollapse) => [
  {
    ...columns[0],
    cellTransforms: [
      ...(columns[0].cellTransforms || []),
      treeRow(
        (...args) => onCollapse?.(...args)
        // TODO add Selection feature
      ),
    ],
  },
  ...columns.slice(1),
];

const views = {
  loading: {
    tableProps: (_items, columns) => ({
      rows: [
        {
          cells: [
            {
              title: () => <Spinner />, // eslint-disable-line react/display-name
              props: {
                colSpan: columns.length,
              },
            },
          ],
        },
      ],
    }),
    checkOptions: () => true,
  },
  // TODO implement "Something went wrong" (here or higher up)
  error: {},
  empty: {
    tableProps: (_items, columns) => ({
      rows: [
        {
          cells: [
            {
              title: () => <NoResultsTable />, // eslint-disable-line react/display-name
              props: {
                colSpan: columns.length,
              },
            },
          ],
        },
      ],
    }),
    checkOptions: () => true,
  },
  rows: {
    tableProps: (items, columns, options) => {
      const rows = rowsBuilder(items, columns, options);

      return rows ? { rows } : {};
    },
    icon: ListIcon,
    checkOptions: () => true,
  },
  tree: {
    tableProps: (items, columns, options) => {
      const rows = treeChopper(items, columns, options);
      const cells = treeColumns(columns, options.expandable.onCollapse);

      return rows
        ? {
            cells,
            rows,
            isTreeTable: true,
          }
        : {};
    },
    icon: TreeviewIcon,
    toolbarProps: () => ({
      variant: 'compact',
    }),
    checkOptions: ({ tableTree }) => !!tableTree,
  },
};

export default views;
