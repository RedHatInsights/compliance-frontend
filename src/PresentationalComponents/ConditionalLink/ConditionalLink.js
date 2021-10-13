import React from 'react';
import PropTypes from 'prop-types';

const ConditionalLink = ({ children, href, ...additionalProps }) =>
  (href && (
    <a href={href} {...additionalProps}>
      {children}
    </a>
  )) ||
  children ||
  '';

ConditionalLink.propTypes = {
  children: PropTypes.node,
  href: PropTypes.string,
};

export default ConditionalLink;
