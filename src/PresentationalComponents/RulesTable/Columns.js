import { fitContent, nowrap } from '@patternfly/react-table';
import {
  Rule,
  Policy as PolicyCell,
  Severity as SeverityCell,
  Passed as PassedCell,
  RemediationColumnCell,
} from './Cells';

export const Name = {
  title: 'Name',
  sortable: 'title',
  renderExport: ({ title, identifier }) =>
    `${title}${identifier ? ` - ${identifier.label}` : ''}`,
  Component: Rule,
};

export const Policy = {
  title: 'Policy',
  renderExport: (rule) => rule.profile_name,
  Component: PolicyCell,
};

export const Severity = {
  title: 'Severity',
  sortable: 'severity',
  exportKey: 'severity',
  Component: SeverityCell,
};

export const Passed = {
  title: 'Rule state',
  sortable: 'result',
  renderExport: (rule) => (rule?.compliant ? 'Yes' : 'No'),
  Component: PassedCell,
  transforms: [fitContent],
};

export const Remediation = {
  title: 'Remediation type',
  transforms: [nowrap],
  sortable: 'remediation_available',
  renderExport: (rule) => (rule?.remediation_available ? 'Playbook' : 'Manual'),
  Component: RemediationColumnCell,
};

export default [Name, Policy, Severity, Passed, Remediation];
