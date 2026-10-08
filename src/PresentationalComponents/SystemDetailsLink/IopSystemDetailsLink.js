import React from 'react';
import propTypes from 'prop-types';

const IopSystemDetailsLink = ({ displayName, children }) => (
  <a href={`/new/hosts/${displayName}#/Compliance`} target="_top">
    {children}
  </a>
);

IopSystemDetailsLink.propTypes = {
  id: propTypes.string,
  displayName: propTypes.string,
  children: propTypes.node,
};

export default IopSystemDetailsLink;
