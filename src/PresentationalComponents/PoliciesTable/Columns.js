import React from 'react';
import propTypes from 'prop-types';
import { TextContent } from '@patternfly/react-core';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import { GreySmallText, SystemsCountWarning } from 'PresentationalComponents';
import { renderComponent } from 'Utilities/helpers';

const PolicyNameCell = ({ id, policy, policyType }) => (
  <TextContent>
    <Link to={'/scappolicies/' + id}>{policy.name}</Link>
    <GreySmallText>{policyType}</GreySmallText>
  </TextContent>
);

PolicyNameCell.propTypes = {
  id: propTypes.string,
  policy: propTypes.object,
  policyType: propTypes.string,
};

export const Name = {
  title: 'Name',
  props: {
    width: 25,
  },
  sortByProp: 'name',
  sortable: 'title',
  renderExport: (policy) => policy.name,
  renderFunc: renderComponent(PolicyNameCell),
};

export const Description = {
  title: 'Description',
  sortByProp: 'description',
  renderExport: (policy) => policy.description,
  hiddenByDefault: true,
  isShown: false,
};

const PolicyType = {
  title: 'Policy Type',
  renderExport: (policy) => policy.policyType,
};

const osString = (policy) => `RHEL ${policy.osMajorVersion}`;

export const OperatingSystem = {
  title: 'Operating system',
  sortByProp: 'osMajorVersion',
  sortable: 'os_major_version',
  renderExport: osString,
  renderFunc: (_data, _id, policy) => osString(policy),
};

export const Systems = {
  title: 'Systems',
  sortByProp: 'totalHostCount',
  sortable: 'total_system_count',
  renderExport: (policy) => policy.totalHostCount,
  // eslint-disable-next-line react/display-name
  renderFunc: (_data, _id, policy) =>
    policy.totalHostCount > 0 ? (
      policy.totalHostCount
    ) : (
      <SystemsCountWarning count={policy.totalHostCount} variant="count" />
    ),
};

const businessObjectiveString = (policy) =>
  (policy.businessObjective && policy.businessObjective.title) || '--';

export const BusinessObjective = {
  title: 'Business objective',
  sortByFunction: (policy) => policy?.businessObjective?.title ?? '',
  sortable: 'business_objective',
  renderExport: businessObjectiveString,
  renderFunc: (_data, _id, policy) => businessObjectiveString(policy),
};

const complianceThresholdString = (policy) => `${policy.complianceThreshold}%`;

export const ComplianceThreshold = {
  title: 'Compliance threshold',
  sortByProp: 'complianceThreshold',
  sortable: 'compliance_threshold',
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
