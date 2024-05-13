import React from 'react';
import propTypes from 'prop-types';
import { AnsibleTowerIcon } from '@patternfly/react-icons';

const RemediationCell = ({ hasPlaybook = false }) => (
  <>
    {hasPlaybook && <AnsibleTowerIcon />}
    {hasPlaybook ? ' Playbook' : ' Manual'}
  </>
);
RemediationCell.propTypes = {
  hasPlaybook: propTypes.bool,
};

export default RemediationCell;
