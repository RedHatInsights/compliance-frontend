import React from 'react';
import { fixedPercentage } from 'Utilities/TextHelper';
import propTypes from 'prop-types';
import { Content, ContentVariants } from '@patternfly/react-core';
import { LinkWithPermission as Link } from 'PresentationalComponents';

const PropTypes = {
  children: propTypes.node,
};

const Dt = ({ children, ...props }) => (
  <Content {...props} component={ContentVariants.dt}>
    {children}
  </Content>
);
Dt.propTypes = PropTypes;

const Dd = ({ children, ...props }) => (
  <Content {...props} component={ContentVariants.dd}>
    {children}
  </Content>
);
Dd.propTypes = PropTypes;

const ReportDetailsDescription = ({ report }) => (
  <Content className="policy-details">
    <React.Fragment>
      <Content component={ContentVariants.dl}>
        <Dt>
          <Content component="p" className="ins-c-non-bold-h2">
            Policy details
          </Content>
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
      </Content>
      <Link to={'/scappolicies/' + report.id}>View policy</Link>
    </React.Fragment>
  </Content>
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
