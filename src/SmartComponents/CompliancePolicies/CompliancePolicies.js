import React from 'react';
import GatedComponents from '@/PresentationalComponents/GatedComponents';
import TableStateProvider from '@/Frameworks/AsyncTableTools/components/TableStateProvider';
import CompliancePoliciesRest from 'SmartComponents/CompliancePolicies/CompliancePoliciesRest';
import CompliancePoliciesGraphQL from 'SmartComponents/CompliancePolicies/CompliancePoliciesGraphQL';

const CompliancePoliciesWrapper = () => (
  <TableStateProvider>
    <GatedComponents
      RestComponent={CompliancePoliciesRest}
      GraphQLComponent={CompliancePoliciesGraphQL}
    />
  </TableStateProvider>
);

export default CompliancePoliciesWrapper;
