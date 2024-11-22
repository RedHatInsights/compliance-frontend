import React from 'react';

import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Text, TextContent } from '@patternfly/react-core';
import propTypes from 'prop-types';

const PolicyRulesHeader = ({ name, benchmarkVersion, osMajorVersion }) => {
  return (
    <PageHeader className="pf-v5-u-pt-xl pf-v5-u-pl-xl">
      <PageHeaderTitle
        title={`Compliance | Default rules for ${name} policy`}
      />
      <TextContent className="pf-v5-u-mb-md pf-v5-u-mt-md">
        <Text>
          This is a read-only view of the full set of rules and their
          description for
          <b> {name} policy</b> operating on
          <br />
          <b>RHEL {osMajorVersion}</b> - <b>SSG version: {benchmarkVersion}</b>
        </Text>
        <Text>Rule selection must be made in the policy modal</Text>
      </TextContent>
    </PageHeader>
  );
};
export default PolicyRulesHeader;

PolicyRulesHeader.propTypes = {
  name: propTypes.string,
  benchmarkVersion: propTypes.string,
  osMajorVersion: propTypes.string,
};
