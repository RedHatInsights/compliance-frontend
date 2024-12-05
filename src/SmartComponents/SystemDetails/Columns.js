import { renderComponent } from 'Utilities/helpers';
import { Passed as PassedCell, RemediationColumnCell, Rule } from './Cells';
import {
  Passed,
  Policy,
  Remediation,
  Severity,
} from '@/PresentationalComponents/RulesTable/Columns';

export const Name = {
  title: 'Name',
  sortByProp: 'title',
  sortable: 'title',
  renderExport: ({ title, identifier }) =>
    `${title}${identifier ? ` - ${identifier.label}` : ''}`,
  renderFunc: renderComponent(Rule),
};

export const PassedSystemDetails = {
  ...Passed,
  renderExport: ({ result }) => (result === 'pass' ? 'Yes' : 'No'),
  renderFunc: renderComponent(PassedCell),
};

export const RemediationSystemDetails = {
  ...Remediation,
  sortByFunction: (rule) => rule?.remediation_issue_id,
  renderExport: (rule) => (rule?.remediation_issue_id ? 'Playbook' : 'Manual'),
  renderFunc: renderComponent(RemediationColumnCell),
};

export default [
  Name,
  Policy,
  Severity,
  PassedSystemDetails,
  RemediationSystemDetails,
];
