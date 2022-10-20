import React from 'react';
import { Link } from 'react-router-dom';
import propTypes from 'prop-types';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

const ViewAffectedLink = ({ message, policy }) => {
  return (
    <React.Fragment>
      <Link
        key={`${policy?.id}`}
        target="_blank"
        to={`/policies/${policy?.id}/default_ruleset`}
      >
        {message}
        <ExternalLinkAltIcon className="pf-u-ml-sm" />
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
