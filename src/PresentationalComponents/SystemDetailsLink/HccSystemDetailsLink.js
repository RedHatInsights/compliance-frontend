import React from 'react';
import propTypes from 'prop-types';
import InsightsLink from '@redhat-cloud-services/frontend-components/InsightsLink';

const HccSystemDetailsLink = ({ id, children }) => (
  <InsightsLink app="compliance" to={{ pathname: `/systems/${id}` }}>
    {children}
  </InsightsLink>
);

HccSystemDetailsLink.propTypes = {
  id: propTypes.string,
  displayName: propTypes.string,
  children: propTypes.node,
};

export default HccSystemDetailsLink;
