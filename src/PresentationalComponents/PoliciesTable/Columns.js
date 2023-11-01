import React, { Fragment } from 'react';
import propTypes from 'prop-types';
import { TextContent, Tooltip } from '@patternfly/react-core';
import { fitContent } from '@patternfly/react-table';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import { GreySmallText, SystemsCountWarning } from 'PresentationalComponents';
import { renderComponent } from 'Utilities/helpers';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';

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
  renderExport: (policy) => policy.name,
  renderFunc: renderComponent(PolicyNameCell),
};

const PolicyType = {
  title: 'Policy Type',
  renderExport: (policy) => policy.policyType,
};

const osString = (policy) => `RHEL ${policy.osMajorVersion}`;

export const OperatingSystem = {
  title: 'Operating system',
  transforms: [fitContent],
  props: {
    width: 15,
  },
  sortByProp: 'osMajorVersion',
  renderExport: osString,
  renderFunc: (_data, _id, policy) => osString(policy),
};

export const Systems = {
  title: (
    <Tooltip
      position="top"
      content={
        <Fragment>
          This count only reflects the systems you have permission to access.
        </Fragment>
      }
    >
      <span className="pf-c-table__text">
        Systems &nbsp;
        <OutlinedQuestionCircleIcon className="grey-icon" />
      </span>
    </Tooltip>
  ),
  props: {
    width: 15,
  },
  sortByProp: 'totalHostCount',
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
  sortByFunction: (policy) => policy?.businessObjective?.title,
  renderExport: businessObjectiveString,
  renderFunc: (_data, _id, policy) => businessObjectiveString(policy),
};

const complianceThresholdString = (policy) => `${policy.complianceThreshold}%`;

export const ComplianceThreshold = {
  title: 'Compliance threshold',
  sortByProp: 'complianceThreshold',
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
];

export default [
  Name,
  OperatingSystem,
  Systems,
  BusinessObjective,
  ComplianceThreshold,
];
