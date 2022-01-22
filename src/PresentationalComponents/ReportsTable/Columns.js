import { fitContent } from '@patternfly/react-table';
import { renderComponent } from 'Utilities/helpers';
import {
  Name as NameCell,
  OperatingSystem as OperatingSystemCell,
  CompliantSystems as CompliantSystemsCell,
  PDFExportDownload as PDFExportDownloadCell,
} from './Cells';

export const Name = {
  title: 'Policy',
  key: 'name',
  sortByProp: 'name',
  props: {
    width: 60,
  },
  exportKey: 'name',
  renderFunc: renderComponent(NameCell),
};

export const OperatingSystem = {
  title: 'Operating system',
  key: 'operating_system',
  isRequired: true,
  transforms: [fitContent],
  sortByProp: 'osMajorVersion',
  props: {
    width: 20,
  },
  renderExport: ({ osMajorVersion }) => `RHEL ${osMajorVersion} `,
  renderFunc: renderComponent(OperatingSystemCell),
};

export const CompliantSystems = {
  title: 'Systems meeting compliance',
  key: 'systems_meeting_compliance',
  transforms: [fitContent],
  sortByFunction: ({ testResultHostCount, compliantHostCount }) =>
    (100 / testResultHostCount) * compliantHostCount,
  props: {
    width: 20,
  },
  renderExport: ({
    testResultHostCount = 0,
    compliantHostCount = 0,
    unsupportedHostCount = 0,
  }) =>
    `${compliantHostCount} of ${testResultHostCount} systems${
      unsupportedHostCount > 0 ? ` | ${unsupportedHostCount} unsupported` : ''
    }`,
  renderFunc: renderComponent(CompliantSystemsCell),
};

export const PDFExportDownload = {
  title: '',
  renderFunc: renderComponent(PDFExportDownloadCell),
};

const PolicyType = {
  title: 'Policy Type',
  key: 'policy_type',
  renderExport: (profile) => profile.policyType,
};

export const exportableColumns = [
  Name,
  PolicyType,
  OperatingSystem,
  CompliantSystems,
];

export default [Name, OperatingSystem, CompliantSystems];
