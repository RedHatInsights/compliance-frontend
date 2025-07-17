import { Passed as PassedCell, RemediationColumnCell, Rule } from './Cells';
import {
  Passed,
  Policy,
  Remediation,
  Severity,
} from '@/PresentationalComponents/RulesTable/Columns';

export const Name = {
  title: 'Name',
  sortable: 'title',
  renderExport: ({ title, identifier }) =>
    `${title}${identifier ? ` - ${identifier.label}` : ''}`,
  Component: Rule,
};

export const PassedSystemDetails = {
  ...Passed,
  renderExport: ({ result }) => (result === 'pass' ? 'passed' : 'failed'),
  Component: PassedCell,
};

export const RemediationSystemDetails = {
  ...Remediation,
  sortByFunction: (rule) => rule?.remediation_issue_id,
  renderExport: (rule) => (rule?.remediation_issue_id ? 'Playbook' : 'Manual'),
  Component: RemediationColumnCell,
};

export default [
  Name,
  Policy,
  Severity,
  PassedSystemDetails,
  RemediationSystemDetails,
];
