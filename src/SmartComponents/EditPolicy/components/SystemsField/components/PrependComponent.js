import React from 'react';
import { Text, TextContent } from '@patternfly/react-core';
import propTypes from 'prop-types';

const PrependComponent = ({ osMajorVersion }) => (
  <>
    <TextContent className="pf-u-mb-md">
      <Text>
        Select which of your <b>RHEL {osMajorVersion}</b> systems should be
        included in this policy.
      </Text>
    </TextContent>
  </>
);

PrependComponent.propTypes = {
  osMajorVersion: propTypes.string,
};

export default PrependComponent;
