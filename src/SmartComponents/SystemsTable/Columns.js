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
  CustomDisplay as CustomDisplayCell,
  FailedRulesRest as FailedRulesRestCell,
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

export const SsgVersion = (apiV2Enabled = false) =>
  compileColumnRenderFunc({
    title: 'SSG version',
    transforms: [nowrap],
    exportKey: 'testResultProfiles',
    sortBy: apiV2Enabled ? ['security_guide_version'] : ['ssg_version'],
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

export const FailedRules = (apiV2Enabled = false) =>
  compileColumnRenderFunc({
    title: 'Failed rules',
    key: 'failedRules',
    exportKey: apiV2Enabled ? 'rulesFailed' : 'profiles',
    transforms: [nowrap],
    sortBy: apiV2Enabled ? ['failed_rule_count'] : ['rulesFailed'],
    props: {
      width: 5,
    },
    renderExport: (profiles) => {
      if (apiV2Enabled) {
        return profiles;
      }
      return profiles.reduce(
        (failedRules, { rulesFailed }) => failedRules + rulesFailed,
        0
      );
    },
    renderFunc: renderComponent(
      apiV2Enabled ? FailedRulesRestCell : FailedRulesCell
    ),
    cell: apiV2Enabled ? FailedRulesRestCell : FailedRulesCell,
  });

export const ComplianceScore = (apiV2Enabled = false) =>
  compileColumnRenderFunc({
    title: 'Compliance score',
    key: 'complianceScore',
    exportKey: apiV2Enabled ? null : 'testResultProfiles',
    sortBy: apiV2Enabled ? ['score'] : ['complianceScore'],
    sortable: 'score',
    transforms: [nowrap],
    props: {
      width: 5,
    },
    renderExport: (testResultProfiles) => {
      if (apiV2Enabled) {
        return complianceScoreString(testResultProfiles);
      }
      return complianceScoreString(
        complianceScoreData(testResultProfiles)
      ).trim();
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

export const OperatingSystem = (apiV2Enabled = false) =>
  compileColumnRenderFunc({
    title: 'Operating system',
    key: 'operatingSystem',
    sortBy: apiV2Enabled
      ? ['os_version']
      : ['osMajorVersion', 'osMinorVersion'], // Use parameter to set sortBy
    transforms: [nowrap],
    renderExport: (cell) => operatingSystemString(cell),
    cell: OperatingSystemCell,
  });

export const OS = (apiV2Enabled = false) =>
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
    sortBy: apiV2Enabled
      ? ['os_version']
      : ['osMajorVersion', 'osMinorVersion'],
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
