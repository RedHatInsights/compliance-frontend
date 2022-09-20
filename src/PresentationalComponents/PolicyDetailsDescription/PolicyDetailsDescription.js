import React from 'react';
import propTypes from 'prop-types';
import { fixedPercentage } from 'Utilities/TextHelper';
import {
  Card,
  CardHeader,
  CardBody,
  TextContent,
  TextVariants,
  Text,
} from '@patternfly/react-core';
import linkifyHtml from 'linkifyjs/html';
import EditPolicyDetailsInline2 from '../../SmartComponents/EditPolicyDetails/EditPolicyDetailsInline2';

const PolicyDetailsDescription = ({ policy }) => {
  const thresholdText = `${fixedPercentage(
    policy.complianceThreshold,
    1
  )} of rules must be
  passed for a system to be labeled "Compliant"`;
  const businessText =
    (policy.businessObjective && policy.businessObjective.title) || '-';
  const descriptionText = linkifyHtml(policy.description || '');

  return (
    <Card ouiaId="PolicyDetailsCard">
      <CardHeader>
        <Text style={{ fontSize: 20 }}>
          <b>Policy details</b>
        </Text>
      </CardHeader>
      <CardBody>
        <TextContent>
          <EditPolicyDetailsInline2
            policyData={policy}
            text={policy.complianceThreshold}
            variant="threshold"
            inlineClosedText={thresholdText}
            inlineTitleText="Compliance threshold (%)"
            showTextUnderInline="true"
            textUnderInline="A value of 95% or higher is recommended"
          />
          <EditPolicyDetailsInline2
            policyData={policy}
            text={businessText}
            variant="business"
            inlineClosedText={businessText}
            inlineTitleText="Business objective"
          />
          <EditPolicyDetailsInline2
            policyData={policy}
            text={descriptionText}
            variant="description"
            inlineClosedText={businessText}
            inlineTitleText="Policy description"
          />
          <Text component={TextVariants.h5}>Operating system</Text>
          <Text component={TextVariants.p}>RHEL {policy.osMajorVersion}</Text>
          <Text component={TextVariants.h5}>Policy type </Text>
          <Text component={TextVariants.p}>{policy.policyType}</Text>
          <Text component={TextVariants.h5}>Reference ID</Text>
          <Text component={TextVariants.p}>{policy.refId}</Text>
        </TextContent>
      </CardBody>
    </Card>
  );
};
PolicyDetailsDescription.propTypes = {
  policy: propTypes.object,
};

export default PolicyDetailsDescription;
