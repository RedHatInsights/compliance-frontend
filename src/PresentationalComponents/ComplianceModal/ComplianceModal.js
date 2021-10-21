import React from 'react';
import propTypes from 'prop-types';
import { Modal } from '@patternfly/react-core';

// Provides a modal with defaults used in compliance
const ComplianceModal = ({ children, className = '', ...props }) => {
  return (
    <Modal
      className={`compliance${className ? ` ${className}` : ''}`}
      {...props}
    >
      {children}
    </Modal>
  );
};

ComplianceModal.propTypes = {
  children: propTypes.node,
  className: propTypes.string,
};

export default ComplianceModal;
