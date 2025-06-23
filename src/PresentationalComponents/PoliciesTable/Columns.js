import React from 'react';
import propTypes from 'prop-types';
import { Content } from '@patternfly/react-core';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import { GreySmallText, SystemsCountWarning } from 'PresentationalComponents';
import { renderComponent } from 'Utilities/helpers';

const PolicyNameCell = ({ id, title, profile_title }) => (
  <Content>
    <Link to={'/scappolicies/' + id}>{title}</Link>
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
  renderFunc: renderComponent(PolicyNameCell),
};

export const Description = {
  title: 'Description',
  renderExport: (policy) => policy.description,
  hiddenByDefault: true,
  isShown: false,
};

const osString = (policy) => `RHEL ${policy.os_major_version}`;

export const OperatingSystem = {
  title: 'Operating system',
  sortable: 'os_major_version',
  renderExport: osString,
  renderFunc: (_data, _id, policy) => osString(policy),
};

export const Systems = {
  title: 'Systems',
  sortable: 'total_system_count',
  renderExport: (policy) => policy.total_system_count,

  renderFunc: (_data, _id, policy) =>
    policy.total_system_count > 0 ? (
      policy.total_system_count
    ) : (
      <SystemsCountWarning count={policy.total_system_count} variant="count" />
    ),
};

const businessObjectiveString = (policy) => policy.business_objective ?? '--';

export const BusinessObjective = {
  title: 'Business objective',
  sortable: 'business_objective',
  renderExport: businessObjectiveString,
  renderFunc: (_data, _id, policy) => businessObjectiveString(policy),
};

const complianceThresholdString = (policy) => `${policy.compliance_threshold}%`;

export const ComplianceThreshold = {
  title: 'Compliance threshold',
  sortable: 'compliance_threshold',
  renderExport: complianceThresholdString,
  renderFunc: (_data, _id, policy) => complianceThresholdString(policy),
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
