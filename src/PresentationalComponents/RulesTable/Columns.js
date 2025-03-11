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
  sortable: 'title',
  renderExport: ({ title, identifier }) =>
    `${title}${identifier ? ` - ${identifier.label}` : ''}`,
  renderFunc: renderComponent(Rule),
};

export const Policy = {
  title: 'Policy',
  renderExport: (rule) => rule.profile_name,
  renderFunc: renderComponent(PolicyCell),
};

export const Severity = {
  title: 'Severity',
  sortable: 'severity',
  exportKey: 'severity',
  renderFunc: renderComponent(SeverityCell),
};

export const Passed = {
  title: 'Rule state',
  sortable: 'result',
  renderExport: (rule) => (rule?.compliant ? 'Yes' : 'No'),
  renderFunc: renderComponent(PassedCell),
  transforms: [fitContent],
};

export const Remediation = {
  title: 'Remediation',
  transforms: [nowrap],
  sortable: 'remediation_available',
  renderExport: (rule) => (rule?.remediation_available ? 'Playbook' : 'Manual'),
  renderFunc: renderComponent(RemediationColumnCell),
};

export default [Name, Policy, Severity, Passed, Remediation];
