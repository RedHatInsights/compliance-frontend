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
  sortBy: ['name'],
  props: {
    width: 40,
  },
  renderExport: (system) => `${system.name} (${operatingSystemString(system)})`,
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
    exportKey: 'testResultProfiles',
    sortBy: ['security_guide_version'],
    key: 'ssg_version',
    renderExport: (testResultProfiles) =>
      testResultProfiles
        .map(
          ({ supported, benchmark: { version } }) =>
            `${!supported ? '!' : ''}${version}`
        )
        .join(', '),
    cell: SsgVersionCell,
  });

export const Policies = {
  title: 'Policies',
  transforms: [nowrap],
  key: 'policies',
  exportKey: 'policies',
  renderExport: (policies) => policies.map(({ name }) => name).join(', '),
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
    exportKey: 'rulesFailed',
    transforms: [nowrap],
    sortBy: ['failed_rule_count'],
    props: {
      width: 5,
    },
    renderExport: (profiles) => {
      return profiles;
    },
    renderFunc: renderComponent(FailedRulesCell),
    cell: FailedRulesCell,
  });

export const ComplianceScore = () =>
  compileColumnRenderFunc({
    title: 'Compliance score',
    key: 'complianceScore',
    exportKey: null,
    sortBy: ['score'],
    sortable: 'score',
    transforms: [nowrap],
    props: {
      width: 5,
    },
    renderExport: (testResultProfiles) => {
      return complianceScoreString(testResultProfiles);
    },
    cell: ComplianceScoreCell,
  });

export const LastScanned = {
  title: 'Last scanned',
  key: 'lastScanned',
  transforms: [nowrap],
  exportKey: 'testResultProfiles',
  props: {
    width: 10,
    ...disableSorting,
  },
  renderExport: (testResultProfiles) => lastScanned(testResultProfiles),
  renderFunc: renderComponent(LastScannedCell),
};

export const OperatingSystem = () =>
  compileColumnRenderFunc({
    title: 'Operating system',
    key: 'operatingSystem',
    sortBy: ['os_version'],
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
    sortBy: ['os_version'],
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
