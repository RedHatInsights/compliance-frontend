import React from 'react';
import { Content, ContentVariants } from '@patternfly/react-core';
import ComparisonTable from './components/ComparisonTable/ComparisonTable';

const RuleComparison = ({
  tailoringId,
  policyId,
  securityGuideProfile,
  osMinorVersionToCompare,
}) => {
  return (
    <>
      <Content component={ContentVariants.h2}>Rule comparison</Content>
      <ComparisonTable
        tailoringId={tailoringId}
        policyId={policyId}
        securityGuideProfile={securityGuideProfile}
        osMinorVersionToCompare={osMinorVersionToCompare}
      />
    </>
  );
};

export default RuleComparison;
