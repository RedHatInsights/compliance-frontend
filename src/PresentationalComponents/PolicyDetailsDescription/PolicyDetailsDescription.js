import React from 'react';
import propTypes from 'prop-types';
import { fixedPercentage } from 'Utilities/TextHelper';
import {
  Card,
  CardHeader,
  CardBody,
  TextContent,
  Text,
  TextVariants,
  TextArea,
} from '@patternfly/react-core';
import linkifyHtml from 'linkifyjs/html';
import EditPolicyDetailsInline from '../../SmartComponents/EditPolicyDetails/EditPolicyDetailsInline';

const PolicyDetailsDescription = ({ policy, refetch }) => {
  const thresholdText = `${fixedPercentage(
    policy.compliance_threshold,
    1
  )} of rules must be
  passed for a system to be labeled "Compliant"`;
  const businessText = policy.business_objective || '-';
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
          <Text>
            <EditPolicyDetailsInline
              policy={policy}
              refetch={refetch}
              text={policy.compliance_threshold}
              variant="threshold"
              inlineClosedText={thresholdText}
              label="Compliance threshold (%)"
              showTextUnderInline="true"
              textUnderInline="A value of 95% or higher is recommended"
              propertyName="complianceThreshold"
              type="number"
              className="pf-v5-c-form-control pf-v5-u-w-100-on-lg"
              aria-label="editable text input"
              id="policydetails-input-threshold"
            />
          </Text>
          <Text>
            <EditPolicyDetailsInline
              policy={policy}
              refetch={refetch}
              text={businessText}
              variant="business"
              inlineClosedText={businessText}
              label="Business objective"
              propertyName="businessObjective"
              typeOfInput="text"
            />
          </Text>
          <Text>
            <EditPolicyDetailsInline
              policy={policy}
              refetch={refetch}
              Component={TextArea}
              text={descriptionText}
              variant="description"
              inlineClosedText={businessText}
              label="Policy description"
              propertyName="description"
              className="pf-v5-c-form-control"
              style={{
                minWidth: '50%',
              }}
            />
          </Text>
          <Text component={TextVariants.h5}>Operating system</Text>
          <Text component={TextVariants.p}>RHEL {policy.os_major_version}</Text>
          <Text component={TextVariants.h5}>Policy type </Text>
          <Text component={TextVariants.p}>{policy.profile_title}</Text>
          <Text component={TextVariants.h5}>Reference ID</Text>
          <Text component={TextVariants.p}>{policy.ref_id}</Text>
        </TextContent>
      </CardBody>
    </Card>
  );
};
PolicyDetailsDescription.propTypes = {
  policy: propTypes.object,
  refetch: propTypes.func,
};

export default PolicyDetailsDescription;
