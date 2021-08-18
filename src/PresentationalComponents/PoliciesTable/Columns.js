import React from 'react';
import propTypes from 'prop-types';
import { TextContent } from '@patternfly/react-core';
import { fitContent } from '@patternfly/react-table';
import { Link } from 'react-router-dom';
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
    width: 45,
  },
  sortByProp: 'name',
  renderFunc: renderComponent(PolicyNameCell),
};

export const OperatingSystem = {
  title: 'Operating system',
  transforms: [fitContent],
  props: {
    width: 15,
  },
  sortByProp: 'majorOsVersion',
  renderFunc: (_data, _id, policy) => `RHEL ${policy.majorOsVersion}`,
};

export const Systems = {
  title: 'Systems',
  props: {
    width: 15,
  },
  sortByProp: 'totalHostCount',
  // eslint-disable-next-line react/display-name
  renderFunc: (_data, _id, policy) =>
    policy.totalHostCount > 0 ? (
      policy.totalHostCount
    ) : (
      <SystemsCountWarning count={policy.totalHostCount} variant="count" />
    ),
};

export const BusinessObjective = {
  title: 'Business objective',
  sortByFunction: (policy) => policy?.businessObjective?.title,
  renderFunc: (_data, _id, policy) =>
    (policy.businessObjective && policy.businessObjective.title) || '--',
};

export const ComplianceThreshold = {
  title: 'Compliance threshold',
  sortByProp: 'complianceThreshold',
  renderFunc: (_data, _id, policy) => `${policy.complianceThreshold}%`,
};

export default [
  Name,
  OperatingSystem,
  Systems,
  BusinessObjective,
  ComplianceThreshold,
];
