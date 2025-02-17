import React from 'react';
import { fixedPercentage } from 'Utilities/TextHelper';
import propTypes from 'prop-types';
import {
  Text,
  TextContent,
  TextList,
  TextListVariants,
  TextListItem,
  TextListItemVariants,
} from '@patternfly/react-core';
import { LinkWithPermission as Link } from 'PresentationalComponents';

const PropTypes = {
  children: propTypes.node,
};

const Dt = ({ children, ...props }) => (
  <TextListItem {...props} component={TextListItemVariants.dt}>
    {children}
  </TextListItem>
);
Dt.propTypes = PropTypes;

const Dd = ({ children, ...props }) => (
  <TextListItem {...props} component={TextListItemVariants.dd}>
    {children}
  </TextListItem>
);
Dd.propTypes = PropTypes;

const ReportDetailsDescription = ({ report }) => (
  <TextContent className="policy-details">
    <React.Fragment>
      <TextList component={TextListVariants.dl}>
        <Dt>
          <Text className="ins-c-non-bold-h2">Policy details</Text>
        </Dt>
        <Dt>Operating system</Dt>
        <Dd>RHEL {report.os_major_version}</Dd>
        <Dt>Compliance threshold</Dt>
        <Dd>
          {`${fixedPercentage(report.compliance_threshold, 1)} of rules must be
          passed for a system to be labeled "Compliant"`}
        </Dd>
        <Dt>Business objective</Dt>
        <Dd>{report.business_objective || '--'}</Dd>
      </TextList>
      <Link to={'/scappolicies/' + report.id}>View policy</Link>
    </React.Fragment>
  </TextContent>
);

ReportDetailsDescription.propTypes = {
  report: propTypes.shape({
    id: propTypes.string,
    compliance_threshold: propTypes.number,
    business_objective: propTypes.string,
    os_major_version: propTypes.string,
  }),
};

export default ReportDetailsDescription;
