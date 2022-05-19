import { nowrap } from '@patternfly/react-table';
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
  renderExport: ({ title, identifier }) =>
    `${title}${identifier ? ` - ${identifier.label}` : ''}`,
  renderFunc: renderComponent(Rule),
};

export const Policy = {
  title: 'Policy',
  sortByFunction: (rule) => rule?.profile?.name,
  renderExport: (rule) => rule?.profile?.name,
  renderFunc: renderComponent(PolicyCell),
};

export const Severity = {
  title: 'Severity',
  sortByProp: 'severity',
  exportKey: 'severity',
  sortByArray: ['high', 'medium', 'low', 'unknown'],
  renderFunc: renderComponent(SeverityCell),
};

export const Passed = {
  title: 'Passed',
  sortByProp: 'compliant',
  renderExport: (rule) => (rule?.compliant ? 'Yes' : 'No'),
  renderFunc: renderComponent(PassedCell),
};

export const Remediation = {
  title: 'Remediation',
  transforms: [nowrap],
  sortByFunction: (rule) => rule?.remediationIssueId,
  renderExport: (rule) => (rule?.remediationIssueId ? 'Playbook' : 'Manual'),
  renderFunc: renderComponent(RemediationColumnCell),
};

export default [Name, Policy, Severity, Passed, Remediation];
