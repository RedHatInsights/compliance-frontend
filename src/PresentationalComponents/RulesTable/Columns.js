import { fitContent, nowrap } from '@patternfly/react-table';
import { renderComponent } from 'Utilities/helpers';
import {
  Rule,
  Policy as PolicyCell,
  Severity as SeverityCell,
  Passed as PassedCell,
  RemediationColumnCell,
} from './Cells';

export const Name = {
  title: 'Name',
  sortByProp: 'title',
  sortable: 'title',
  renderExport: ({ title, identifier }) =>
    `${title}${identifier ? ` - ${identifier.label}` : ''}`,
  renderFunc: renderComponent(Rule),
};

export const Policy = {
  title: 'Policy',
  sortByFunction: (rule) => rule?.profile?.name,
  renderExport: (rule) => rule?.profile?.name || rule.profile_name,
  renderFunc: renderComponent(PolicyCell),
};

export const Severity = {
  title: 'Severity',
  sortByProp: 'severity',
  sortable: 'severity',
  exportKey: 'severity',
  sortByArray: ['high', 'medium', 'low', 'unknown'],
  renderFunc: renderComponent(SeverityCell),
};

export const Passed = {
  title: 'Rule state',
  sortByProp: 'compliant',
  renderExport: (rule) => (rule?.compliant ? 'Yes' : 'No'),
  renderFunc: renderComponent(PassedCell),
  transforms: [fitContent],
};

export const Remediation = {
  title: 'Remediation',
  transforms: [nowrap],
  sortable: 'remediation_available',
  sortByFunction: (rule) => rule?.remediationAvailable,
  renderExport: (rule) =>
    rule?.remediationAvailable || rule?.remediation_available
      ? 'Playbook'
      : 'Manual',
  renderFunc: renderComponent(RemediationColumnCell),
};

export default [Name, Policy, Severity, Passed, Remediation];
