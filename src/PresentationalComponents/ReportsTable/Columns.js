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
  sortByProp: 'name',
  props: {
    width: 60,
  },
  renderFunc: renderComponent(NameCell),
};

export const OperatingSystem = {
  title: 'Operating system',
  transforms: [fitContent],
  sortByProp: 'majorOsVersion',
  props: {
    width: 20,
  },
  renderFunc: renderComponent(OperatingSystemCell),
};

export const CompliantSystems = {
  title: 'Systems meeting compliance',
  transforms: [fitContent],
  sortByFunction: ({ testResultHostCount, compliantHostCount }) =>
    (100 / testResultHostCount) * compliantHostCount,
  props: {
    width: 20,
  },
  renderFunc: renderComponent(CompliantSystemsCell),
};

export const PDFExportDownload = {
  title: '',
  renderFunc: renderComponent(PDFExportDownloadCell),
};

export default [Name, OperatingSystem, CompliantSystems];
