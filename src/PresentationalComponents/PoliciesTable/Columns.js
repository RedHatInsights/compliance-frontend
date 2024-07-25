import React from 'react';
import propTypes from 'prop-types';
import { TextContent } from '@patternfly/react-core';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import { GreySmallText, SystemsCountWarning } from 'PresentationalComponents';
import { renderComponent } from 'Utilities/helpers';

const PolicyNameCell = ({ id, title, profile_title }) => (
  <TextContent>
    <Link to={'/scappolicies/' + id}>{title}</Link>
    <GreySmallText>{profile_title}</GreySmallText>
  </TextContent>
);

PolicyNameCell.propTypes = {
  id: propTypes.string,
  title: propTypes.object,
  profile_title: propTypes.string,
};

export const Name = {
  title: 'Name',
  props: {
    width: 25,
  },
  sortByProp: 'title',
  renderExport: (policy) => policy.title,
  renderFunc: renderComponent(PolicyNameCell),
};

export const Description = {
  title: 'Description',
  sortByProp: 'description',
  renderExport: (policy) => policy.description,
  hiddenByDefault: true,
};

const PolicyType = {
  title: 'Policy Type',
  renderExport: (policy) => policy.type,
};

const osString = (policy) => `RHEL ${policy.os_major_version}`;

export const OperatingSystem = {
  title: 'Operating system',
  sortByProp: 'os_major_version',
  renderExport: osString,
  renderFunc: (_data, _id, policy) => osString(policy),
};

export const Systems = {
  title: 'Systems',
  sortByProp: 'total_system_count',
  renderExport: (policy) => policy.total_system_count,
  // eslint-disable-next-line react/display-name
  renderFunc: (_data, _id, policy) =>
    policy.total_system_count > 0 ? (
      policy.total_system_count
    ) : (
      <SystemsCountWarning count={policy.total_system_count} variant="count" />
    ),
};

const businessObjectiveString = (policy) => policy.business_objective || '--';

export const BusinessObjective = {
  title: 'Business objective',
  sortByFunction: (policy) => policy?.business_objective,
  renderExport: businessObjectiveString,
  renderFunc: (_data, _id, policy) => businessObjectiveString(policy),
};

const complianceThresholdString = (policy) => `${policy.compliance_threshold}%`;

export const ComplianceThreshold = {
  title: 'Compliance threshold',
  sortByProp: 'compliance_threshold',
  renderExport: complianceThresholdString,
  renderFunc: (_data, _id, policy) => complianceThresholdString(policy),
};

export const exportableColumns = [
  Name,
  PolicyType,
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
