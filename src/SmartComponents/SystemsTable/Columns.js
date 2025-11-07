/* eslint-disable testing-library/render-result-naming-convention */
import React from 'react';
import { nowrap } from '@patternfly/react-table';
import { Tooltip } from '@patternfly/react-core';
import { complianceScoreString } from 'PresentationalComponents';
import { renderComponent } from 'Utilities/helpers';

import {
  Name as NameCell,
  ComplianceScore as ComplianceScoreCell,
  LastScanned as LastScannedCell,
  Policies as PoliciesCell,
  SSGVersions as SsgVersionCell,
  lastScanned,
  operatingSystemString,
  OperatingSystem as OperatingSystemCell,
  CustomDisplay as CustomDisplayCell,
  FailedRules as FailedRulesCell,
} from './Cells';

const disableSorting = { isStatic: true };

export const compileColumnRenderFunc = ({ cell, ...column }) => ({
  ...column,
  renderFunc: renderComponent(cell, column.props),
});

export const customColumn = (column, props) =>
  compileColumnRenderFunc({
    ...column,
    props: {
      ...column.props,
      ...props,
    },
  });

export const Name = compileColumnRenderFunc({
  key: 'name',
  title: 'Name',
  sortable: 'display_name',
  props: {
    width: 40,
  },
  renderExport: (system) =>
    `${system.display_name} (${operatingSystemString(system)})`,

  cell: NameCell,
});

export const customDisplay = (props, columnConfig) => ({
  ...Name,
  ...props,
  props: {
    ...Name.props,
    ...props,
  },
  renderFunc: renderComponent(CustomDisplayCell, props),
  ...columnConfig,
});

export const customName = (props, columnConfig) => ({
  ...Name,
  props: {
    ...Name.props,
    ...props,
  },
  renderFunc: renderComponent(NameCell, props),
  ...columnConfig,
});

export const SsgVersion = () =>
  compileColumnRenderFunc({
    title: 'SSG version',
    transforms: [nowrap],
    sortable: 'security_guide_version',
    key: 'ssg_version',
    renderExport: ({ security_guide_version, supported }) => {
      return supported ? security_guide_version : `!${security_guide_version}`;
    },
    cell: SsgVersionCell,
  });

export const Policies = {
  title: 'Policies',
  transforms: [nowrap],
  key: 'policies',
  exportKey: 'policies',
  renderExport: (policies) => policies.map(({ title }) => title).join(', '),
  props: {
    width: 40,
    ...disableSorting,
  },
  renderFunc: renderComponent(PoliciesCell),
};

export const FailedRules = () =>
  compileColumnRenderFunc({
    title: 'Failed rules',
    key: 'failedRules',
    exportKey: 'failed_rule_count',
    transforms: [nowrap],
    sortable: 'failed_rule_count',
    props: {
      width: 5,
    },
    renderFunc: renderComponent(FailedRulesCell),
    cell: FailedRulesCell,
  });

export const ComplianceScore = () =>
  compileColumnRenderFunc({
    title: 'Compliance score',
    key: 'complianceScore',
    sortable: 'score',
    transforms: [nowrap],
    props: {
      width: 5,
    },
    renderExport: ({ score, supported, compliant }) =>
      complianceScoreString({ score, supported, compliant }),
    cell: ComplianceScoreCell,
  });

export const LastScanned = {
  title: 'Last scanned',
  key: 'lastScanned',
  transforms: [nowrap],
  props: {
    width: 10,
    ...disableSorting,
  },
  renderExport: ({ end_time }) => lastScanned(end_time),
  renderFunc: renderComponent(LastScannedCell),
};

export const OperatingSystem = () =>
  compileColumnRenderFunc({
    title: 'Operating system',
    key: 'operatingSystem',
    sortable: 'os_version',
    transforms: [nowrap],
    renderExport: (cell) => operatingSystemString(cell),
    cell: OperatingSystemCell,
  });

export const OS = () =>
  compileColumnRenderFunc({
    title: (
      <Tooltip content={<span>Operating System</span>}>
        <span>OS</span>
      </Tooltip>
    ),
    original: 'Operating System',
    key: 'operatingSystem',
    dataLabel: 'OS',
    transforms: [nowrap],
    sortable: 'os_version',
    props: {
      width: 10,
    },
    renderExport: (cell) => operatingSystemString(cell),
    cell: OperatingSystemCell,
  });

export const inventoryColumn = (column, props) => ({
  key: column,
  ...props,
});

export const Workspaces = inventoryColumn('groups', {
  title: 'Workspaces',
  requiresDefault: true,
  sortable: 'groups',
  renderExport: ({ groups }) => groups.map(({ name }) => name).join(', '),
});

export const Updated = inventoryColumn('updated', {
  title: 'Last seen',
  props: { isStatic: true },
  transforms: [nowrap],
  renderExport: ({ updated }) => updated,
});

export const Tags = inventoryColumn('tags', {
  title: 'Tags',
  renderExport: ({ tags }) => tags.length,
});
