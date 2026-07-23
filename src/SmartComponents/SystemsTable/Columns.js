import React from 'react';
import { nowrap } from '@patternfly/react-table';
import { Tooltip } from '@patternfly/react-core';
import { DateFormat } from '@redhat-cloud-services/frontend-components/DateFormat';
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

export const Name = {
  key: 'name',
  title: 'Name',
  sortable: 'display_name',
  props: {
    width: 40,
  },
  renderExport: (system) =>
    `${system.display_name} (${operatingSystemString(system)})`,
  renderFunc: renderComponent(NameCell),
};

export const customDisplay = (props) => ({
  ...Name,
  ...props,
  props: {
    ...Name.props,
    ...props,
  },
  renderFunc: renderComponent(CustomDisplayCell, props),
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
  sortable: 'security_guide_version',
  key: 'ssg_version',
  renderExport: ({ security_guide_version, supported }) => {
    return supported ? security_guide_version : `!${security_guide_version}`;
  },
  renderFunc: renderComponent(SsgVersionCell),
};

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

export const FailedRules = {
  title: 'Failed rules',
  key: 'failedRules',
  exportKey: 'failed_rule_count',
  transforms: [nowrap],
  sortable: 'failed_rule_count',
  props: {
    width: 5,
  },
  renderFunc: renderComponent(FailedRulesCell),
};

export const ComplianceScore = {
  title: 'Compliance score',
  key: 'complianceScore',
  sortable: 'score',
  transforms: [nowrap],
  props: {
    width: 5,
  },
  renderExport: ({ score, supported, compliant }) =>
    complianceScoreString({ score, supported, compliant }),
  renderFunc: renderComponent(ComplianceScoreCell),
};

export const LastScanned = {
  title: 'Last scanned',
  key: 'lastScanned',
  transforms: [nowrap],
  props: { width: 10, ...disableSorting },
  renderExport: ({ end_time }) => lastScanned(end_time),
  renderFunc: renderComponent(LastScannedCell),
};

export const OS = {
  title: (
    <Tooltip content={<span>Operating System</span>}>
      <span>OS</span>
    </Tooltip>
  ),
  key: 'operatingSystem',
  dataLabel: 'OS',
  transforms: [nowrap],
  sortable: 'os_version',
  props: {
    width: 10,
  },
  renderExport: (cell) => operatingSystemString(cell),
  renderFunc: renderComponent(OperatingSystemCell),
};

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

export const LastSeen = inventoryColumn('updated', {
  title: 'Last seen',
  props: { isStatic: true },
  transforms: [nowrap],
  renderFunc: (value) => (
    <span className="pf-v6-u-text-nowrap">
      <DateFormat date={value} />
    </span>
  ),
  renderExport: ({ updated }) => updated,
});

export const Tags = inventoryColumn('tags', {
  title: 'Tags',
  renderExport: ({ tags }) => tags.length,
});
