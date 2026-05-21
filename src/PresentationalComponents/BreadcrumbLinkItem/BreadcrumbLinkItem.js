import React from 'react';
import propTypes from 'prop-types';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import { BreadcrumbItem } from '@patternfly/react-core';

const RouterLink = ({ href, to, ...props }) => (
  <Link {...props} to={to ?? href} />
);

RouterLink.propTypes = {
  href: propTypes.string,
  to: propTypes.string,
};

const BreadcrumbLinkItem = ({ children, ...props }) => (
  <BreadcrumbItem {...props} component={RouterLink}>
    {children}
  </BreadcrumbItem>
);

BreadcrumbLinkItem.propTypes = {
  children: propTypes.node,
};

export default BreadcrumbLinkItem;
