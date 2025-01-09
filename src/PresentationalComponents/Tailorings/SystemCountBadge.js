import React from 'react';
import propTypes from 'prop-types';
import { Badge, pluralize } from '@patternfly/react-core';

const SystemCountBadge = ({ count = 0 }) => (
  <Badge isRead>{`${pluralize(count, 'system')}`}</Badge>
);

SystemCountBadge.propTypes = {
  count: propTypes.number,
};

export default SystemCountBadge;
