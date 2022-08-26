import React from 'react';
import { nowrap } from '@patternfly/react-table';
import { Tooltip } from '@patternfly/react-core';
import { complianceScoreString } from 'PresentationalComponents';
import { profilesRulesFailed } from 'Utilities/ruleHelpers';
import { renderComponent } from 'Utilities/helpers';

import {
  Name as NameCell,
  ComplianceScore as ComplianceScoreCell,
  DetailsLink as DetailsLinkCell,
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

export const customName = (props) => ({
  ...Name,
  props: {
    ...Name.props,
    ...props,
  },
  renderFunc: renderComponent(NameCell, props),
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
  exportKey: 'policies',
  renderExport: (policies) => policies.map(({ name }) => name).join(', '),
  props: {
    width: 40,
    ...disableSorting,
  },
  renderFunc: renderComponent(PoliciesCell),
};

export const DetailsLink = {
  title: '',
  export: false,
  props: {
    width: 20,
    ...disableSorting,
  },
  renderFunc: renderComponent(DetailsLinkCell),
};

export const FailedRules = {
  title: 'Failed rules',
  exportKey: 'testResultProfiles',
  transforms: [nowrap],
  props: {
    width: 5,
    ...disableSorting,
  },
  renderExport: (testResultProfiles) =>
    profilesRulesFailed(testResultProfiles).length,
  renderFunc: renderComponent(FailedRulesCell),
};

export const ComplianceScore = {
  title: 'Compliance score',
  exportKey: 'testResultProfiles',
  transforms: [nowrap],
  props: {
    width: 5,
    ...disableSorting,
  },
  renderExport: (testResultProfiles) =>
    complianceScoreString(complianceScoreData(testResultProfiles)).trim(),
  renderFunc: renderComponent(ComplianceScoreCell),
};

export const LastScanned = {
  title: 'Last scanned',
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
