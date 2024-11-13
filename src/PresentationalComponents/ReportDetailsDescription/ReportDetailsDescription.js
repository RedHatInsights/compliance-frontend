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

const PolicyDescription = ({ profile }) => (
  <React.Fragment>
    <TextList component={TextListVariants.dl}>
      <Dt>
        <Text className="ins-c-non-bold-h2">Policy details</Text>
      </Dt>
      <Dt>Operating system</Dt>
      <Dd>RHEL {profile.osMajorVersion}</Dd>
      <Dt>Compliance threshold</Dt>
      <Dd>
        {`${fixedPercentage(profile.complianceThreshold, 1)} of rules must be
        passed for a system to be labeled "Compliant"`}
      </Dd>
      <Dt>Business objective</Dt>
      <Dd>
        {profile.businessObjective ? profile.businessObjective.title : '--'}
      </Dd>
    </TextList>
    <Link to={'/scappolicies/' + profile.id}>View policy</Link>
  </React.Fragment>
);

PolicyDescription.propTypes = {
  profile: propTypes.shape({
    id: propTypes.string,
    complianceThreshold: propTypes.number,
    businessObjective: propTypes.object,
    osMajorVersion: propTypes.string,
    policy: propTypes.shape({
      id: propTypes.string,
    }),
    benchmark: propTypes.shape({
      version: propTypes.string,
    }),
  }),
};

const ReportDetailsDescription = ({ profile }) => (
  <TextContent className="policy-details">
    <PolicyDescription {...{ profile }} />
  </TextContent>
);

ReportDetailsDescription.propTypes = {
  profile: propTypes.object,
};

export default ReportDetailsDescription;
