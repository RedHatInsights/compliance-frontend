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
import { Link } from 'react-router-dom';

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
      <Dd>RHEL {profile.majorOsVersion}</Dd>
      <Dt>Compliance threshold</Dt>
      <Dd>{fixedPercentage(profile.complianceThreshold, 1)}</Dd>
      <Dt>Business objective</Dt>
      <Dd>
        {profile.businessObjective ? profile.businessObjective.title : '--'}
      </Dd>
    </TextList>
    <Link to={'/scappolicies/' + profile.policy.id}>View policy</Link>
  </React.Fragment>
);

PolicyDescription.propTypes = {
  profile: propTypes.shape({
    id: propTypes.string,
    complianceThreshold: propTypes.number,
    businessObjective: propTypes.object,
    majorOsVersion: propTypes.string,
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
