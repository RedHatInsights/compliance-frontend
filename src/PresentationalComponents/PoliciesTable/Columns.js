import React from 'react';
import propTypes from 'prop-types';
import { Content } from '@patternfly/react-core';
import Link from '@redhat-cloud-services/frontend-components/InsightsLink';
import { GreySmallText, SystemsCountWarning } from 'PresentationalComponents';

const PolicyNameCell = ({ id, title, profile_title }) => (
  <Content>
    <Link app="compliance" to={'/scappolicies/' + id}>
      {title}
    </Link>
    <GreySmallText>{profile_title}</GreySmallText>
  </Content>
);

PolicyNameCell.propTypes = {
  id: propTypes.string,
  title: propTypes.string,
  profile_title: propTypes.string,
};

export const Name = {
  title: 'Name',
  props: {
    width: 25,
  },
  sortable: 'title',
  renderExport: (policy) => policy.title,
  Component: PolicyNameCell,
};

export const Description = {
  title: 'Description',
  key: 'description',
  exportKey: 'description',
  hiddenByDefault: true,
  isShown: false,
};

export const OperatingSystem = {
  title: 'Operating system',
  sortable: 'os_major_version',
  renderExport: ({ os_major_version }) => `RHEL ${os_major_version}`,
  Component: ({ os_major_version }) => `RHEL ${os_major_version}`,
};

export const Systems = {
  title: 'Systems',
  sortable: 'total_system_count',
  renderExport: (policy) => policy.total_system_count,
  // eslint-disable-next-line
  Component: ({ total_system_count }) =>
    total_system_count > 0 ? (
      total_system_count
    ) : (
      <SystemsCountWarning count={total_system_count} variant="count" />
    ),
};

const businessObjectiveString = (policy) => policy.business_objective ?? '--';

export const BusinessObjective = {
  title: 'Business objective',
  sortable: 'business_objective',
  renderExport: businessObjectiveString,
  Component: (policy) => businessObjectiveString(policy),
};

const complianceThresholdString = (policy) => `${policy.compliance_threshold}%`;

export const ComplianceThreshold = {
  title: 'Compliance threshold',
  sortable: 'compliance_threshold',
  renderExport: complianceThresholdString,
  Component: (policy) => complianceThresholdString(policy),
};

export const exportableColumns = [
  Name,
  OperatingSystem,
  Systems,
  BusinessObjective,
  ComplianceThreshold,
  Description,
];

export default [
  Name,
  OperatingSystem,
  Systems,
  BusinessObjective,
  ComplianceThreshold,
  Description,
];
