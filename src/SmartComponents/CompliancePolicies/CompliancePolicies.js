import React from 'react';
import useAPIV2FeatureFlag from '../../Utilities/hooks/useAPIV2FeatureFlag';
import TableStateProvider from '../../Frameworks/AsyncTableTools/components/TableStateProvider';
import CompliancePoliciesRest from './CompliancePoliciesRest';
import CompliancePoliciesGraphQL from './CompliancePoliciesGraphQL';
import PageHeader, {
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';

const CompliancePolicies = () => {
  const apiV2Enabled = useAPIV2FeatureFlag();

  return apiV2Enabled ? (
    <CompliancePoliciesRest />
  ) : (
    <CompliancePoliciesGraphQL />
  );
};

const CompliancePoliciesWrapperWithTableStateProvider = () => (
  <TableStateProvider>
    <PageHeader className="page-header">
      <PageHeaderTitle title="SCAP policies" />
    </PageHeader>
    <section className="pf-v5-c-page__main-section">
      <CompliancePolicies />
    </section>
  </TableStateProvider>
);

export default CompliancePoliciesWrapperWithTableStateProvider;
