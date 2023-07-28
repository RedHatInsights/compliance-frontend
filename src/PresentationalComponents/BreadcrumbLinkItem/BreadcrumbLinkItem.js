import React from 'react';
import propTypes from 'prop-types';
import { LinkWithPermission as Link } from 'PresentationalComponents';
import { BreadcrumbItem } from '@patternfly/react-core';

const RouterLink = ({ href, ...props }) => <Link {...props} to={href} />;

RouterLink.propTypes = {
  href: propTypes.string,
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
