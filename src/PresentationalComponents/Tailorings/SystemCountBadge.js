import React from 'react';
import propTypes from 'prop-types';
import { Badge } from '@patternfly/react-core';
import { pluralizeTerm } from '@/Utilities/helpers';

const SystemCountBadge = ({ count = 0 }) => (
  <Badge isRead>{pluralizeTerm(count, 'system')}</Badge>
);

SystemCountBadge.propTypes = {
  count: propTypes.number,
};

export default SystemCountBadge;
