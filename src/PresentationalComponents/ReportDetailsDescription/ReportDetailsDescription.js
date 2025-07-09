import React from 'react';
import { fixedPercentage } from 'Utilities/TextHelper';
import propTypes from 'prop-types';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import {
  Content,
  DescriptionList,
  DescriptionListTerm,
  DescriptionListGroup,
  DescriptionListDescription,
} from '@patternfly/react-core';

const ReportDetailsDescription = ({ report }) => {
  const thresholdText = `${fixedPercentage(report.compliance_threshold, 1)} of rules must be passed for a system to be labeled "Compliant"`;

  return (
    <>
      <Content component="p" className="ins-c-non-bold-h2">
        Policy details
      </Content>
      <DescriptionList className="policy-details" isHorizontal isCompact>
        <DescriptionListGroup>
          <DescriptionListTerm>Operating system</DescriptionListTerm>
          <DescriptionListDescription>
            RHEL {report.os_major_version}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Compliance threshold</DescriptionListTerm>
          <DescriptionListDescription>
            {thresholdText}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <DescriptionListGroup>
          <DescriptionListTerm>Business objective</DescriptionListTerm>
          <DescriptionListDescription>
            {report.business_objective || '--'}
          </DescriptionListDescription>
        </DescriptionListGroup>
        <Link to={'/scappolicies/' + report.id}>View policy</Link>
      </DescriptionList>
    </>
  );
};

ReportDetailsDescription.propTypes = {
  report: propTypes.shape({
    id: propTypes.string,
    compliance_threshold: propTypes.number,
    business_objective: propTypes.string,
    os_major_version: propTypes.string,
  }),
};

export default ReportDetailsDescription;
