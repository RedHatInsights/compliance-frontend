import React from 'react';
import propTypes from 'prop-types';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';

const ComplianceLink = ({ to, app = 'compliance', ...props }) => (
  <InsightsLink app={app} to={to} {...props} />
);

ComplianceLink.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
  app: propTypes.string,
};

export default ComplianceLink;
