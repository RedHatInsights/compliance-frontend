/* eslint-disable testing-library/render-result-naming-convention */
import React from 'react';
import { nowrap } from '@patternfly/react-table';
import { Tooltip } from '@patternfly/react-core';
import { complianceScoreString } from 'PresentationalComponents';
import { renderComponent } from 'Utilities/helpers';

import {
  Name as NameCell,
  ComplianceScore as ComplianceScoreCell,
  FailedRules as FailedRulesCell,
  LastScanned as LastScannedCell,
  Policies as PoliciesCell,
  SSGVersions as SsgVersionCell,
  complianceScoreData,
  lastScanned,
  operatingSystemString,
  OperatingSystem as OperatingSystemCell,
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

export const customName = (props, columnConfig) => ({
  ...Name,
  props: {
    ...Name.props,
    ...props,
  },
  renderFunc: renderComponent(NameCell, props),
  ...columnConfig,
});

export const SsgVersion = {
  title: 'SSG version',
  transforms: [nowrap],
  exportKey: 'testResultProfiles',
  sortBy: ['ssg_version'],
  key: 'ssg_version',
  renderExport: (testResultProfiles) =>
    testResultProfiles
      .map(
        ({ supported, benchmark: { version } }) =>
          `${!supported ? '!' : ''}${version}`
      )
      .join(', '),
  renderFunc: renderComponent(SsgVersionCell),
};

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

export const FailedRules = {
  title: 'Failed rules',
  key: 'failedRules',
  exportKey: 'profiles',
  transforms: [nowrap],
  sortBy: ['rulesFailed'],
  props: {
    width: 5,
  },
  renderExport: (profiles) =>
    profiles.reduce(
      (failedRules, { rulesFailed }) => failedRules + rulesFailed,
      0
    ),
  renderFunc: renderComponent(FailedRulesCell),
};

export const ComplianceScore = {
  title: 'Compliance score',
  key: 'complianceScore',
  exportKey: 'testResultProfiles',
  sortBy: ['score'],
  transforms: [nowrap],
  props: {
    width: 5,
  },
  renderExport: (testResultProfiles) =>
    complianceScoreString(complianceScoreData(testResultProfiles)).trim(),
  renderFunc: renderComponent(ComplianceScoreCell),
};

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

export const OperatingSystem = compileColumnRenderFunc({
  title: 'Operating system',
  key: 'operatingSystem',
  sortBy: ['osMajorVersion', 'osMinorVersion'],
  transforms: [nowrap],
  renderExport: (cell) => operatingSystemString(cell),
  cell: OperatingSystemCell,
});

export const OS = compileColumnRenderFunc({
  title: (
    <Tooltip content={<span>Operating System</span>}>
      <span>OS</span>
    </Tooltip>
  ),
  original: 'Operating System',
  key: 'operatingSystem',
  dataLabel: 'OS',
  transforms: [nowrap],
  sortBy: ['osMajorVersion', 'osMinorVersion'],
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
