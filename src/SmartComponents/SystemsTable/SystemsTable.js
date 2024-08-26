import React from 'react';
import SystemsTableGraphQL from './SystemsTableGraphQL';
import SystemsTableRest from './SystemsTableRest';
import PropTypes from 'prop-types';

const SystemsTable = (props) => {
  console.log('debug: hello', props.apiV2Enabled);
  return props.apiV2Enabled ? (
    <SystemsTableRest {...props} />
  ) : (
    <SystemsTableGraphQL {...props} />
  );
};

SystemsTable.propTypes = {
  apiV2Enabled: PropTypes.bool,
};
export default SystemsTable;
