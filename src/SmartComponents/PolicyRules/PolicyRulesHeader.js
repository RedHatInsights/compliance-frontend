import React from 'react';

import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { Content } from '@patternfly/react-core';
import propTypes from 'prop-types';

const PolicyRulesHeader = ({ name, securityGuideVersion, osMajorVersion }) => {
  return (
    <PageHeader className="pf-v5-u-pt-xl pf-v5-u-pl-xl">
      <PageHeaderTitle
        title={`Compliance | Default rules for ${name} policy`}
      />
      <Content className="pf-v5-u-mb-md pf-v5-u-mt-md">
        <Content component="p">
          This is a read-only view of the full set of rules and their
          description for
          <b> {name} policy</b> operating on
          <br />
          <b>RHEL {osMajorVersion}</b> -{' '}
          <b>SSG version: {securityGuideVersion}</b>
        </Content>
        <Content component="p">
          Rule selection must be made in the policy modal
        </Content>
      </Content>
    </PageHeader>
  );
};
export default PolicyRulesHeader;

PolicyRulesHeader.propTypes = {
  name: propTypes.string,
  securityGuideVersion: propTypes.string,
  osMajorVersion: propTypes.string,
};
