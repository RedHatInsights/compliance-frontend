import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';

const ViewAffectedLink = ({ message, policy }) => {
  console.log(policy, ' here');
  return (
    <React.Fragment>
      <Link key={`${policy.id}`} to={`/policies/${policy.id}/default_ruleset`}>
        {message}
      </Link>
    </React.Fragment>
  );
};

export default ViewAffectedLink;

ViewAffectedLink.propTypes = {
  message: propTypes.string,
  policy: propTypes.shape({
    name: propTypes.string,
    id: propTypes.string,
    rules: propTypes.array,
    benchmark: propTypes.object,
  }),
};
