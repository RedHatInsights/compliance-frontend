import React from 'react';
import { fitContent } from '@patternfly/react-table';
import { AnsibeTowerIcon } from '@patternfly/react-icons';
import { renderComponent } from 'Utilities/helpers';
import {
  Rule,
  Policy as PolicyCell,
  Severity as SeverityCell,
  Passed as PassedCell,
  Ansible as AnsibleCell,
} from './Cells';

export const Name = {
  title: 'Name',
  sortByProp: 'title',
  renderFunc: renderComponent(Rule),
};

export const Policy = {
  title: 'Policy',
  sortByFunction: (rule) => rule?.profile?.name,
  renderFunc: renderComponent(PolicyCell),
};

export const Severity = {
  title: 'Severity',
  sortByProp: 'severity',
  transforms: [fitContent],
  sortByArray: ['high', 'medium', 'low', 'unknown'],
  renderFunc: renderComponent(SeverityCell),
};

export const Passed = {
  title: 'Passed',
  sortByProp: 'compliant',
  renderFunc: renderComponent(PassedCell),
};

export const Ansible = {
  title: (
    <span>
      <AnsibeTowerIcon /> Ansible
    </span>
  ),
  original: 'Ansible',
  props: {
    tooltip: 'Ansible',
  },
  transforms: [fitContent],
  sortByProp: 'remediationAvailable',
  renderFunc: renderComponent(AnsibleCell),
};
