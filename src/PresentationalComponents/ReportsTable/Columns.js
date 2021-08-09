import { fitContent } from '@patternfly/react-table';
import { renderComponent } from 'Utilities/helpers';
import {
  Name as NameCell,
  OperatingSystem as OperatingSystemCell,
  CompliantSystems as CompliantSystemsCell,
} from './Cells';

export const Name = {
  title: 'Policy',
  sortByProp: 'name',
  props: {
    width: 55,
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
    width: 25,
  },
  renderFunc: renderComponent(CompliantSystemsCell),
};
