import { fitContent } from '@patternfly/react-table';
import {
  Name as NameCell,
  OperatingSystem as OperatingSystemCell,
  CompliantSystems as CompliantSystemsCell,
  PDFExportDownload as PDFExportDownloadCell,
} from './Cells';

export const Name = {
  title: 'Policy',
  sortable: 'title',
  props: {
    width: 60,
  },
  exportKey: 'title',
  Component: NameCell,
};

export const OperatingSystem = {
  title: 'Operating system',
  transforms: [fitContent],
  sortable: 'os_major_version',
  props: {
    width: 20,
  },
  renderExport: ({ os_major_version }) => `RHEL ${os_major_version} `,
  Component: OperatingSystemCell,
};

export const CompliantSystems = {
  title: 'Systems meeting compliance',
  transforms: [fitContent],
  sortable: 'percent_compliant',
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
  Component: CompliantSystemsCell,
};

export const PDFExportDownload = {
  title: '',
  Component: PDFExportDownloadCell,
  manageable: false,
};

export const exportableColumns = [Name, OperatingSystem, CompliantSystems];

export default [Name, OperatingSystem, CompliantSystems];
