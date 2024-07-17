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
  sortByProp: 'title',
  props: {
    width: 60,
  },
  exportKey: 'title',
  renderFunc: renderComponent(NameCell),
};

export const OperatingSystem = {
  title: 'Operating system',
  transforms: [fitContent],
  sortByProp: 'os_major_version',
  props: {
    width: 20,
  },
  renderExport: ({ os_major_version }) => `RHEL ${os_major_version} `,
  renderFunc: renderComponent(OperatingSystemCell),
};

export const CompliantSystems = {
  title: 'Systems meeting compliance',
  transforms: [fitContent],
  sortByFunction: ({ reported_system_count, compliant_system_count }) =>
    (100 / reported_system_count) * compliant_system_count,
  props: {
    width: 20,
  },
  renderExport: ({
    reported_system_count = 0,
    compliant_system_count = 0,
    unsupported_system_count = 0,
  }) =>
    `${compliant_system_count} of ${reported_system_count} systems${
      unsupported_system_count > 0
        ? ` | ${unsupported_system_count} unsupported`
        : ''
    }`,
  renderFunc: renderComponent(CompliantSystemsCell),
};

export const PDFExportDownload = {
  title: '',
  renderFunc: renderComponent(PDFExportDownloadCell),
  managable: false,
};

const PolicyType = {
  title: 'Policy Type',
  renderExport: (profile) => profile.type,
};

export const exportableColumns = [
  Name,
  PolicyType,
  OperatingSystem,
  CompliantSystems,
];

export default [Name, OperatingSystem, CompliantSystems];
