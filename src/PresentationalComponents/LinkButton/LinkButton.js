import React from 'react';
import propTypes from 'prop-types';
import { Button } from '@patternfly/react-core';

const LinkButton = ({ navigate, children, to, ...props }, ref) => {
  return (
    <Button ref={ref} onClick={() => navigate(to)} {...props}>
      {children}
    </Button>
  );
};

LinkButton.propTypes = {
  navigate: propTypes.func,
  children: propTypes.node,
  to: propTypes.oneOfType([propTypes.string, propTypes.object]),
};

export default React.forwardRef(LinkButton);
