import React from 'react';
import { Text, TextContent } from '@patternfly/react-core';
import propTypes from 'prop-types';

const SystemsTableEmptyState = ({ osName = 'RHEL', osMajorVersion }) => (
  <React.Fragment>
    <TextContent className="pf-u-mb-md">
      <Text>
        You do not have any{' '}
        <b>
          {osName} {osMajorVersion}
        </b>{' '}
        systems connected to Insights and enabled for Compliance.
      </Text>
    </TextContent>
    <TextContent className="pf-u-mb-md">
      <Text>
        Connect {osName} {osMajorVersion} systems to Insights.
      </Text>
    </TextContent>
  </React.Fragment>
);

SystemsTableEmptyState.propTypes = {
  osName: propTypes.string.isRequired,
  osMajorVersion: propTypes.string.isRequired,
};

export default SystemsTableEmptyState;
