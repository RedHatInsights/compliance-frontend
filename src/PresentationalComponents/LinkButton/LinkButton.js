import React from 'react';
import propTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import useComplianceNavigate from '@/Utilities/hooks/useComplianceNavigate';

const LinkButton = ({ children, to, ...props }) => {
  const navigate = useComplianceNavigate('compliance');

  return (
    <Button onClick={() => navigate(to)} {...props}>
      {children}
    </Button>
  );
};

LinkButton.propTypes = {
  navigate: propTypes.func,
  children: propTypes.node,
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
};

export default LinkButton;
