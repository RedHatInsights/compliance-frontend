import React from 'react';
import SystemsTableGraphQL from './SystemsTableGraphQL';
import SystemsTableRest from './SystemsTableRest';
import PropTypes from 'prop-types';
import { Bullseye, Spinner } from '@patternfly/react-core';

const SystemsTable = (props) => {
  const GatedComponent = props.apiV2Enabled
    ? SystemsTableRest
    : SystemsTableGraphQL;

  return (
    <>
      {props.apiV2Enabled === undefined ? (
        <Bullseye>
          <Spinner />
        </Bullseye>
      ) : (
        <GatedComponent {...props} />
      )}
    </>
  );
};

SystemsTable.propTypes = {
  apiV2Enabled: PropTypes.bool.isRequired,
};
export default SystemsTable;
