import React from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { resolveComplianceRouterTo } from '@/routing/compliancePaths';

const ComplianceLink = ({ to, ...props }) => (
  <Link to={resolveComplianceRouterTo(to)} {...props} />
);

ComplianceLink.propTypes = {
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
};

export default ComplianceLink;
