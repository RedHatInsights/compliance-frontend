import React from 'react';
import propTypes from 'prop-types';

const RemediationCell = ({ hasPlaybook = false }) => (
  <>{hasPlaybook ? ' Playbook' : ' Manual'}</>
);
RemediationCell.propTypes = {
  hasPlaybook: propTypes.bool,
};

export default RemediationCell;
