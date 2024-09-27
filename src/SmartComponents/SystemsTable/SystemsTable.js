import React from 'react';
import SystemsTableGraphQL from './SystemsTableGraphQL';
import SystemsTableRest from './SystemsTableRest';
import PropTypes from 'prop-types';
import { Bullseye, Spinner } from '@patternfly/react-core';

const SystemsTable = (props) => (
  <>
    {props.apiV2Enabled === undefined ? (
      <Bullseye>
        <Spinner />
      </Bullseye>
    ) : props.apiV2Enabled ? (
      <SystemsTableRest {...props} />
    ) : (
      <SystemsTableGraphQL {...props} />
    )}
  </>
);

SystemsTable.propTypes = {
  apiV2Enabled: PropTypes.bool.isRequired,
};
export default SystemsTable;
