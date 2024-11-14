import { renderComponent } from 'Utilities/helpers';
import { Passed as PassedCell, RemediationColumnCell } from './Cells';
import {
  Name,
  Passed,
  Policy,
  Remediation,
  Severity,
} from '@/PresentationalComponents/RulesTable/Columns';

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
